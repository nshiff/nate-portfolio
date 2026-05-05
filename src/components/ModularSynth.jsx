import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, Plus, Trash2, Volume2, Activity, Waves, Filter as FilterIcon, Settings2, Cable } from 'lucide-react';

// --- Utilities ---
const generateId = () => Math.random().toString(36).substr(2, 9);

// Audio parameters like frequency are perceived logarithmically by the human ear. 
// These utility functions convert linear UI slider values (0-100) to logarithmic frequency values (and vice versa).
const linToExp = (val, min, max) => min * Math.pow(max / min, val);
const expToLin = (val, min, max) => Math.log(val / min) / Math.log(max / min);

// Colors for module types
const MODULE_COLORS = {
    MASTER: 'border-red-500/50 bg-red-950/20',
    VCO: 'border-blue-500/50 bg-blue-950/20',
    LFO: 'border-purple-500/50 bg-purple-950/20',
    VCF: 'border-green-500/50 bg-green-950/20',
    VCA: 'border-orange-500/50 bg-orange-950/20',
};

const PORT_COLORS = {
    audio: 'bg-emerald-400',
    cv: 'bg-amber-400'
};

// --- Web Audio Engine ---
// This class acts as a wrapper around the browser's native Web Audio API.
// It manages the actual sound generation and routing, completely independent of the React UI.
class SynthEngine {
    constructor() {
        // The AudioContext is the master controller and timing engine for all Web Audio operations.
        this.ctx = null;

        // nodes stores the active audio modules. 
        // Format: { [id]: { core: AudioNode[], inputs: { name: AudioNode/AudioParam }, outputs: { name: AudioNode } } }
        // - core: The underlying Web Audio nodes that make up the module.
        // - inputs: Destinations where audio or control voltage (CV) can be routed in.
        // - outputs: Sources where audio or CV comes out.
        this.nodes = {};

        // connections keeps track of which output is plugged into which input.
        // Format: { [connId]: { fromNode, toNode } }
        this.connections = {};
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    stop() {
        if (this.ctx) {
            this.ctx.close(); // Completely destroys the Web Audio context and garbage-collects all nodes
            this.ctx = null;
            this.nodes = {}; // Clear engine memory of old modules
            this.connections = {}; // Clear engine memory of old cables
        }
    }

    // Instantiates Web Audio nodes based on the requested module type.
    addModule(id, type, params) {
        if (!this.ctx) return;

        let core = [];
        let inputs = {};
        let outputs = {};

        switch (type) {
            case 'MASTER': {
                // Master output uses a compressor to act as a limiter, preventing harsh digital clipping.
                const gain = this.ctx.createGain();
                const comp = this.ctx.createDynamicsCompressor();
                gain.connect(comp);
                comp.connect(this.ctx.destination); // this.ctx.destination represents the computer's speakers

                gain.gain.value = params.volume;

                core = [gain, comp];
                inputs = { In: gain };
                break;
            }
            case 'VCO': {
                // Voltage Controlled Oscillator - Generates the raw sound waveform (Sine, Saw, etc.)
                const osc = this.ctx.createOscillator();
                osc.type = params.waveform;
                osc.frequency.value = params.frequency;
                osc.detune.value = params.detune;
                osc.start(); // The Web Audio API requires oscillators to be explicitly started

                core = [osc];
                // 'FM (CV)' (Frequency Modulation) allows other signals to modulate the pitch (detune) of the oscillator.
                inputs = { 'FM (CV)': osc.detune };
                outputs = { Out: osc };
                break;
            }
            case 'LFO': {
                // Low Frequency Oscillator - Used for modulation (like your "wow-wow" effect), not typically for direct audio.
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain(); // Controls the "depth" or strength of the modulation signal
                osc.type = params.waveform;
                osc.frequency.value = params.rate;
                gain.gain.value = params.depth;
                osc.connect(gain);
                osc.start();

                core = [osc, gain];
                inputs = { 'Rate (CV)': osc.frequency };
                outputs = { Out: gain };
                break;
            }
            case 'VCF': {
                // Voltage Controlled Filter - Shapes the sound by cutting/passing certain frequencies.
                const filter = this.ctx.createBiquadFilter();
                filter.type = params.filterType;
                filter.frequency.value = params.frequency; // Cutoff frequency
                filter.Q.value = params.q; // Resonance (creates an emphasis peak at the cutoff point)

                core = [filter];
                // 'Freq (CV)' allows signals to sweep the filter cutoff dynamically.
                inputs = { In: filter, 'Freq (CV)': filter.detune };
                outputs = { Out: filter };
                break;
            }
            case 'VCA': {
                // Voltage Controlled Amplifier - Controls volume.
                const gain = this.ctx.createGain();
                gain.gain.value = params.level;

                core = [gain];
                inputs = { In: gain, 'Level (CV)': gain.gain };
                outputs = { Out: gain };
                break;
            }
        }

        this.nodes[id] = { type, core, inputs, outputs, params };
    }

    removeModule(id) {
        if (!this.nodes[id]) return;

        // Safely disconnect core nodes and stop oscillators to free up memory
        this.nodes[id].core.forEach(node => {
            try { node.stop(); } catch (e) { } // Stop if it's an oscillator node
            node.disconnect();
        });

        delete this.nodes[id];
    }

    // Updates parameters smoothly using setTargetAtTime to prevent audio "clicks" or "pops" 
    // that happen when values change instantly. The 0.05 specifies the transition speed.
    updateParam(id, paramName, value) {
        if (!this.nodes[id]) return;
        const node = this.nodes[id];
        node.params[paramName] = value;

        switch (node.type) {
            case 'MASTER':
                if (paramName === 'volume') node.core[0].gain.setTargetAtTime(value, this.ctx.currentTime, 0.05);
                break;
            case 'VCO':
                if (paramName === 'waveform') node.core[0].type = value;
                if (paramName === 'frequency') node.core[0].frequency.setTargetAtTime(value, this.ctx.currentTime, 0.05);
                if (paramName === 'detune') node.core[0].detune.setTargetAtTime(value, this.ctx.currentTime, 0.05);
                break;
            case 'LFO':
                if (paramName === 'waveform') node.core[0].type = value;
                if (paramName === 'rate') node.core[0].frequency.setTargetAtTime(value, this.ctx.currentTime, 0.05);
                if (paramName === 'depth') node.core[1].gain.setTargetAtTime(value, this.ctx.currentTime, 0.05);
                break;
            case 'VCF':
                if (paramName === 'filterType') node.core[0].type = value;
                if (paramName === 'frequency') node.core[0].frequency.setTargetAtTime(value, this.ctx.currentTime, 0.05);
                if (paramName === 'q') node.core[0].Q.setTargetAtTime(value, this.ctx.currentTime, 0.05);
                break;
            case 'VCA':
                if (paramName === 'level') node.core[0].gain.setTargetAtTime(value, this.ctx.currentTime, 0.05);
                break;
        }
    }

    // Routes audio or CV from an output to an input using Web Audio's native .connect() method
    connect(connId, fromId, fromPort, toId, toPort) {
        const fromModule = this.nodes[fromId];
        const toModule = this.nodes[toId];
        if (!fromModule || !toModule) return;

        const source = fromModule.outputs[fromPort];
        const destination = toModule.inputs[toPort];

        if (source && destination) {
            source.connect(destination);
            this.connections[connId] = { source, destination };
        }
    }

    disconnect(connId) {
        const conn = this.connections[connId];
        if (conn) {
            try {
                conn.source.disconnect(conn.destination);
            } catch (e) {
                console.warn("Failed to disconnect specifically, might already be disconnected", e);
            }
            delete this.connections[connId];
        }
    }
}

// --- Main Application Component ---
export default function ModularSynth() {
    const [isPlaying, setIsPlaying] = useState(false);
    const engineRef = useRef(new SynthEngine());
    const containerRef = useRef(null);
    const portRefs = useRef({});

    // State: Initial layout adjusted for narrow screens
    const [modules, setModules] = useState([
        { id: 'master-1', type: 'MASTER', x: 20, y: 20, params: { volume: 0.8 } }
    ]);
    const [connections, setConnections] = useState([]);

    // Interaction State
    const [draggingModule, setDraggingModule] = useState(null);
    const [cableDrag, setCableDrag] = useState(null); // { sourceId, sourcePort, startX, startY, currX, currY }
    const [cablePaths, setCablePaths] = useState([]);

    // --- Initial Setup / Cleanup ---
    useEffect(() => {
        return () => {
            engineRef.current.stop();
        };
    }, []);

    const togglePlayback = () => {
        if (!isPlaying) {
            engineRef.current.init();
            modules.forEach(m => engineRef.current.addModule(m.id, m.type, m.params));
            connections.forEach(c => engineRef.current.connect(c.id, c.fromId, c.fromPort, c.toId, c.toPort));
            setIsPlaying(true);
        } else {
            engineRef.current.stop();
            setIsPlaying(false);
        }
    };

    // --- Module Management ---
    const addModule = (type) => {
        const id = `${type.toLowerCase()}-${generateId()}`;
        // Spawn within safe bounds for mobile viewports
        const x = Math.max(20, Math.random() * (window.innerWidth > 400 ? 200 : window.innerWidth - 260));
        const y = Math.max(100, Math.random() * (window.innerHeight - 300));

        let defaultParams = {};
        if (type === 'VCO') defaultParams = { waveform: 'sawtooth', frequency: 110, detune: 0 };
        if (type === 'LFO') defaultParams = { waveform: 'sine', rate: 2, depth: 500 };
        if (type === 'VCF') defaultParams = { filterType: 'lowpass', frequency: 1500, q: 2 };
        if (type === 'VCA') defaultParams = { level: 0.5 };

        const newModule = { id, type, x, y, params: defaultParams };
        setModules([...modules, newModule]);

        if (isPlaying) {
            engineRef.current.addModule(id, type, defaultParams);
        }
    };

    const removeModule = (id) => {
        if (id === 'master-1') return;
        const newConnections = connections.filter(c => c.fromId !== id && c.toId !== id);
        connections.forEach(c => {
            if (c.fromId === id || c.toId === id) engineRef.current.disconnect(c.id);
        });
        setConnections(newConnections);
        setModules(modules.filter(m => m.id !== id));
        if (isPlaying) engineRef.current.removeModule(id);
    };

    const bringToFront = (id) => {
        setModules(prev => {
            const index = prev.findIndex(m => m.id === id);
            // If it's not found or already at the front (end of array), do nothing
            if (index === -1 || index === prev.length - 1) return prev;

            const nextModules = [...prev];
            const [movedModule] = nextModules.splice(index, 1);
            nextModules.push(movedModule);
            return nextModules;
        });
    };

    const updateParam = (id, paramName, value) => {
        setModules(mods => mods.map(m => {
            if (m.id === id) return { ...m, params: { ...m.params, [paramName]: value } };
            return m;
        }));
        if (isPlaying) engineRef.current.updateParam(id, paramName, value);
    };

    // --- Touch & Mouse Utilities ---
    // Normalizes coordinates between mouse events and touch events
    const getClientCoords = (e) => {
        if (e.changedTouches && e.changedTouches.length > 0) {
            return { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY };
        } else if (e.touches && e.touches.length > 0) {
            return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
        }
        return { clientX: e.clientX, clientY: e.clientY };
    };

    // Calculates port coordinates relative to the panning container
    const getPortCoords = (moduleId, portName, type) => {
        const portEl = portRefs.current[`${moduleId}-${portName}-${type}`];
        const containerEl = containerRef.current;
        if (!portEl || !containerEl) return { x: 0, y: 0 };

        const portRect = portEl.getBoundingClientRect();
        const contRect = containerEl.getBoundingClientRect();

        return {
            x: portRect.left - contRect.left + portRect.width / 2,
            y: portRect.top - contRect.top + portRect.height / 2
        };
    };

    const updateCableVisuals = useCallback(() => {
        const paths = connections.map(conn => {
            const from = getPortCoords(conn.fromId, conn.fromPort, 'out');
            const to = getPortCoords(conn.toId, conn.toPort, 'in');
            return { id: conn.id, path: generateBezierPath(from, to), color: getModuleColor(conn.fromId) };
        });
        setCablePaths(paths);
    }, [connections, modules]);

    useEffect(() => {
        updateCableVisuals();
    }, [modules, connections, updateCableVisuals]);

    const generateBezierPath = (start, end) => {
        const dx = Math.abs(end.x - start.x) * 0.5;
        const dy = Math.abs(end.y - start.y) * 0.5;
        const controlOffset = Math.max(dx, dy, 50);
        return `M ${start.x} ${start.y} C ${start.x} ${start.y + controlOffset}, ${end.x} ${end.y + controlOffset}, ${end.x} ${end.y}`;
    };

    const getModuleColor = (id) => {
        const type = modules.find(m => m.id === id)?.type;
        switch (type) {
            case 'MASTER': return '#ef4444';
            case 'VCO': return '#3b82f6';
            case 'LFO': return '#a855f7';
            case 'VCF': return '#22c55e';
            case 'VCA': return '#f97316';
            default: return '#94a3b8';
        }
    };

    // --- Unified Interaction Handlers ---
    const handlePortInteractionStart = (e, moduleId, portName, isOutput) => {
        e.stopPropagation();
        if (!isPlaying) return;

        const coords = getPortCoords(moduleId, portName, isOutput ? 'out' : 'in');
        const clientCoords = getClientCoords(e);
        const contRect = containerRef.current.getBoundingClientRect();

        if (isOutput) {
            setCableDrag({
                sourceId: moduleId,
                sourcePort: portName,
                startX: coords.x,
                startY: coords.y,
                currX: clientCoords.clientX - contRect.left,
                currY: clientCoords.clientY - contRect.top
            });
        } else {
            const existingConnIndex = connections.findIndex(c => c.toId === moduleId && c.toPort === portName);
            if (existingConnIndex !== -1) {
                const conn = connections[existingConnIndex];
                engineRef.current.disconnect(conn.id);

                const newConns = [...connections];
                newConns.splice(existingConnIndex, 1);
                setConnections(newConns);

                const startCoords = getPortCoords(conn.fromId, conn.fromPort, 'out');
                setCableDrag({
                    sourceId: conn.fromId,
                    sourcePort: conn.fromPort,
                    startX: startCoords.x,
                    startY: startCoords.y,
                    currX: clientCoords.clientX - contRect.left,
                    currY: clientCoords.clientY - contRect.top
                });
            }
        }
    };

    const handleGlobalMove = (e) => {
        const coords = getClientCoords(e);

        if (draggingModule) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const newX = coords.clientX - containerRect.left - draggingModule.offsetX;
            const newY = coords.clientY - containerRect.top - draggingModule.offsetY;

            setModules(mods => mods.map(m =>
                m.id === draggingModule.id ? { ...m, x: Math.max(0, newX), y: Math.max(0, newY) } : m
            ));
        } else if (cableDrag) {
            const containerRect = containerRef.current.getBoundingClientRect();
            setCableDrag(prev => ({
                ...prev,
                currX: coords.clientX - containerRect.left,
                currY: coords.clientY - containerRect.top
            }));
        }
    };

    const handleGlobalUp = (e) => {
        setDraggingModule(null);

        if (cableDrag) {
            const coords = getClientCoords(e);
            // document.elementFromPoint allows us to figure out what DOM element our finger 
            // was hovering over when lifted, which is required for touch-based drag-and-drop.
            const dropTarget = document.elementFromPoint(coords.clientX, coords.clientY);
            const portEl = dropTarget?.closest('.port');

            if (portEl) {
                const toModuleId = portEl.getAttribute('data-module-id');
                const toPortName = portEl.getAttribute('data-port-name');
                const toPortType = portEl.getAttribute('data-port-type');

                if (toPortType === 'in' && toModuleId !== cableDrag.sourceId) {
                    const existingConnIndex = connections.findIndex(c => c.toId === toModuleId && c.toPort === toPortName);
                    let nextConnections = [...connections];

                    if (existingConnIndex !== -1) {
                        engineRef.current.disconnect(nextConnections[existingConnIndex].id);
                        nextConnections.splice(existingConnIndex, 1);
                    }

                    const newConnId = `conn-${generateId()}`;
                    const newConn = {
                        id: newConnId,
                        fromId: cableDrag.sourceId,
                        fromPort: cableDrag.sourcePort,
                        toId: toModuleId,
                        toPort: toPortName
                    };

                    nextConnections.push(newConn);
                    setConnections(nextConnections);

                    if (isPlaying) {
                        engineRef.current.connect(newConnId, newConn.fromId, newConn.fromPort, newConn.toId, newConn.toPort);
                    }
                }
            }
            setCableDrag(null);
        }
    };

    const handleModuleInteractionStart = (e, id) => {
        if (e.target.closest('.port') || e.target.closest('.knob') || e.target.closest('button')) return;
        const coords = getClientCoords(e);
        const moduleRect = e.currentTarget.getBoundingClientRect();

        setDraggingModule({
            id,
            offsetX: coords.clientX - moduleRect.left,
            offsetY: coords.clientY - moduleRect.top
        });
    };

    // --- Render Helpers ---
    const renderPort = (moduleId, portName, type, label) => {
        const isConnected = connections.some(c =>
            type === 'in' ? (c.toId === moduleId && c.toPort === portName) : (c.fromId === moduleId && c.fromPort === portName)
        );
        const isCV = portName.includes('CV');

        return (
            <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                {type === 'in' && (
                    <div
                        ref={el => portRefs.current[`${moduleId}-${portName}-in`] = el}
                        // Increased target size (w-6 h-6) for touch screens
                        className={`port w-6 h-6 rounded-full border-[3px] border-neutral-700 cursor-crosshair flex items-center justify-center transition-transform hover:scale-110 ${isConnected ? PORT_COLORS[isCV ? 'cv' : 'audio'] : 'bg-neutral-900'}`}
                        onMouseDown={(e) => handlePortInteractionStart(e, moduleId, portName, false)}
                        onTouchStart={(e) => handlePortInteractionStart(e, moduleId, portName, false)}
                        data-module-id={moduleId}
                        data-port-name={portName}
                        data-port-type="in"
                        title={`Input: ${portName}`}
                    />
                )}
                <span className="select-none">{label || portName}</span>
                {type === 'out' && (
                    <div
                        ref={el => portRefs.current[`${moduleId}-${portName}-out`] = el}
                        className={`port w-6 h-6 rounded-full border-[3px] border-neutral-700 cursor-crosshair flex items-center justify-center transition-transform hover:scale-110 ${isConnected ? PORT_COLORS[isCV ? 'cv' : 'audio'] : 'bg-neutral-900'}`}
                        onMouseDown={(e) => handlePortInteractionStart(e, moduleId, portName, true)}
                        onTouchStart={(e) => handlePortInteractionStart(e, moduleId, portName, true)}
                        data-module-id={moduleId}
                        data-port-name={portName}
                        data-port-type="out"
                        title={`Output: ${portName}`}
                    />
                )}
            </div>
        );
    };

    const renderSlider = (module, paramName, label, min, max, isLog = false, step = "any") => {
        const value = module.params[paramName];
        const sliderVal = isLog ? expToLin(value, min, max) * 100 : value;

        const handleChange = (e) => {
            let newVal = parseFloat(e.target.value);
            if (isLog) newVal = linToExp(newVal / 100, min, max);
            updateParam(module.id, paramName, newVal);
        };

        let displayVal = value.toFixed(isLog ? 0 : 2);
        if (paramName === 'frequency') displayVal += ' Hz';
        else if (paramName === 'rate') displayVal += ' Hz';
        else if (paramName === 'detune') displayVal += ' ¢';

        return (
            <div className="flex flex-col gap-1 mb-3">
                <div className="flex justify-between text-[10px] text-gray-400 font-mono uppercase tracking-wider">
                    <span>{label}</span>
                    <span>{displayVal}</span>
                </div>
                <input
                    type="range"
                    // Thicker track for easier touch targeting
                    className="knob w-full h-3 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-gray-400"
                    min={isLog ? 0 : min}
                    max={isLog ? 100 : max}
                    step={isLog ? "any" : step}
                    value={sliderVal}
                    onChange={handleChange}
                    onTouchStart={(e) => e.stopPropagation()} // Prevent dragging module when sliding
                />
            </div>
        );
    };

    const renderSelect = (module, paramName, label, options) => {
        return (
            <div className="flex flex-col gap-1 mb-3">
                <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{label}</div>
                <select
                    className="knob w-full bg-neutral-800 text-sm border border-neutral-600 rounded p-1.5 text-white outline-none focus:border-gray-400"
                    value={module.params[paramName]}
                    onChange={(e) => updateParam(module.id, paramName, e.target.value)}
                    onTouchStart={(e) => e.stopPropagation()}
                >
                    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
        );
    };

    // --- Module Renderers ---
    const renderModuleContents = (module) => {
        switch (module.type) {
            case 'MASTER':
                return (
                    <>
                        <div className="flex justify-between mb-4">
                            {renderPort(module.id, 'In', 'in')}
                        </div>
                        {renderSlider(module, 'volume', 'Master Volume', 0, 1)}
                    </>
                );
            case 'VCO':
                return (
                    <>
                        {renderSelect(module, 'waveform', 'Waveform', [
                            { label: 'Sawtooth', value: 'sawtooth' },
                            { label: 'Square', value: 'square' },
                            { label: 'Sine', value: 'sine' },
                            { label: 'Triangle', value: 'triangle' },
                        ])}
                        {renderSlider(module, 'frequency', 'Freq', 20, 10000, true)}
                        {renderSlider(module, 'detune', 'Detune', -1200, 1200, false, 1)}
                        <div className="mt-4 pt-4 border-t border-neutral-700 flex justify-between">
                            {renderPort(module.id, 'FM (CV)', 'in')}
                            {renderPort(module.id, 'Out', 'out')}
                        </div>
                    </>
                );
            case 'LFO':
                return (
                    <>
                        {renderSelect(module, 'waveform', 'Waveform', [
                            { label: 'Sine', value: 'sine' },
                            { label: 'Square', value: 'square' },
                            { label: 'Sawtooth', value: 'sawtooth' },
                        ])}
                        {renderSlider(module, 'rate', 'Rate', 0.1, 50, true)}
                        {renderSlider(module, 'depth', 'Mod Depth', 0, 2000)}
                        <div className="mt-4 pt-4 border-t border-neutral-700 flex justify-between">
                            <div /> {/* Spacer */}
                            {renderPort(module.id, 'Out', 'out')}
                        </div>
                    </>
                );
            case 'VCF':
                return (
                    <>
                        {renderSelect(module, 'filterType', 'Type', [
                            { label: 'Lowpass', value: 'lowpass' },
                            { label: 'Highpass', value: 'highpass' },
                            { label: 'Bandpass', value: 'bandpass' },
                        ])}
                        {renderSlider(module, 'frequency', 'Cutoff', 20, 15000, true)}
                        {renderSlider(module, 'q', 'Resonance', 0.0001, 20)}

                        <div className="mt-4 pt-4 border-t border-neutral-700 flex flex-col gap-3">
                            <div className="flex justify-between">{renderPort(module.id, 'In', 'in')} {renderPort(module.id, 'Out', 'out')}</div>
                            <div className="flex justify-between">{renderPort(module.id, 'Freq (CV)', 'in')} </div>
                        </div>
                    </>
                );
            case 'VCA':
                return (
                    <>
                        {renderSlider(module, 'level', 'Base Level', 0, 1)}
                        <div className="mt-4 pt-4 border-t border-neutral-700 flex flex-col gap-3">
                            <div className="flex justify-between">{renderPort(module.id, 'In', 'in')} {renderPort(module.id, 'Out', 'out')}</div>
                            <div className="flex justify-between">{renderPort(module.id, 'Level (CV)', 'in')} </div>
                        </div>
                    </>
                );
            default: return null;
        }
    };

    const getModuleIcon = (type) => {
        switch (type) {
            case 'MASTER': return <Volume2 size={16} className="text-red-400" />;
            case 'VCO': return <Waves size={16} className="text-blue-400" />;
            case 'LFO': return <Activity size={16} className="text-purple-400" />;
            case 'VCF': return <FilterIcon size={16} className="text-green-400" />;
            case 'VCA': return <Settings2 size={16} className="text-orange-400" />;
            default: return <Cable size={16} />;
        }
    }

    const getModuleLabel = (type) => {
        switch (type) {
            case 'VCO': return 'Oscillator';
            case 'VCF': return 'Filter';
            case 'VCA': return 'Amplifier';
            case 'MASTER': return 'Master Out';
            default: return type;
        }
    };

    return (
        <div className="h-full w-full bg-neutral-900 text-neutral-100 flex flex-col overflow-hidden font-sans select-none">
            {/* Top Toolbar - Mobile optimized with horizontal scroll / wrapping */}
            <div className="h-16 sm:h-14 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between px-3 sm:px-6 z-20 shrink-0">
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <button
                        onClick={togglePlayback}
                        className={`flex items-center justify-center p-2 sm:px-4 sm:py-1.5 rounded-md font-medium text-sm transition-colors ${isPlaying ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'}`}
                        title={isPlaying ? "Stop Engine" : "Start Engine"}
                    >
                        {isPlaying ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                        <span className="hidden sm:inline ml-2">{isPlaying ? 'Stop' : 'Start'}</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pl-2 py-2 no-scrollbar">
                    {['VCO', 'VCF', 'VCA', 'LFO'].map(type => (
                        <button
                            key={type}
                            onClick={() => addModule(type)}
                            className="flex items-center justify-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 border border-neutral-700 rounded text-sm text-neutral-300 transition-colors shrink-0"
                        >
                            <Plus size={14} /> {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Workspace - Added touch-none to prevent page scroll while dragging */}
            <div
                ref={containerRef}
                className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 to-neutral-900 touch-none"
                onMouseMove={handleGlobalMove}
                onTouchMove={handleGlobalMove}
                onMouseUp={handleGlobalUp}
                onTouchEnd={handleGlobalUp}
                onMouseLeave={handleGlobalUp}
            >
                {/* Grid Background */}
                <div className="absolute inset-0 pointer-events-none opacity-5"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                {/* Cable Canvas */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.5))' }}>
                    {cablePaths.map((c) => (
                        <path
                            key={c.id}
                            d={c.path}
                            stroke={c.color}
                            strokeWidth="5" // Thicker cables visually
                            fill="none"
                            strokeLinecap="round"
                            className="opacity-80 drop-shadow-md transition-all duration-100"
                        />
                    ))}
                    {cableDrag && (
                        <path
                            d={generateBezierPath(
                                { x: cableDrag.startX, y: cableDrag.startY },
                                { x: cableDrag.currX, y: cableDrag.currY }
                            )}
                            stroke="#fbbf24"
                            strokeWidth="5"
                            strokeDasharray="8 4"
                            fill="none"
                            strokeLinecap="round"
                            className="opacity-90 animate-pulse"
                        />
                    )}
                </svg>

                {/* Modules Container */}
                {modules.map(module => (
                    <div
                        key={module.id}
                        onMouseDownCapture={() => bringToFront(module.id)}
                        onTouchStartCapture={() => bringToFront(module.id)}
                        // Slightly wider on mobile for thumb usage, scaling slightly on desktop
                        className={`absolute w-64 sm:w-56 flex flex-col bg-neutral-900/95 backdrop-blur-md rounded-lg border shadow-xl z-20 ${MODULE_COLORS[module.type] || 'border-neutral-700'}`}
                        style={{
                            transform: `translate(${module.x}px, ${module.y}px)`,
                            boxShadow: draggingModule?.id === module.id ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)' : '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        {/* Module Header */}
                        <div
                            className="h-10 sm:h-8 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing border-b border-neutral-800/50 bg-black/30 rounded-t-lg"
                            onMouseDown={(e) => handleModuleInteractionStart(e, module.id)}
                            onTouchStart={(e) => handleModuleInteractionStart(e, module.id)}
                        >
                            <div className="flex items-center gap-2 font-bold sm:font-semibold text-sm sm:text-xs tracking-wider text-neutral-200 pointer-events-none">
                                {getModuleIcon(module.type)}
                                {getModuleLabel(module.type)}
                            </div>
                            {module.type !== 'MASTER' && (
                                <button
                                    onClick={() => removeModule(module.id)}
                                    className="text-neutral-500 hover:text-red-400 active:text-red-300 transition-colors p-2 -m-2"
                                    title="Remove Module"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        {/* Module Body */}
                        <div className="p-4 flex-1 flex flex-col">
                            {renderModuleContents(module)}
                        </div>
                    </div>
                ))}

                {/* Initial Prompt Overlay */}
                {!isPlaying && (
                    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-neutral-900 border border-neutral-700 p-6 sm:p-8 rounded-xl w-full max-w-md text-center shadow-2xl">
                            <Cable className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-500 mx-auto mb-4 sm:mb-6" />
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Welcome to WebModular</h2>
                            <p className="text-neutral-400 text-sm sm:text-base mb-6 leading-relaxed">
                                A browser-based modular synthesizer. Add modules from the top bar, and patch cables by dragging from Outputs (right) to Inputs (left).
                            </p>
                            <button
                                onClick={togglePlayback}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-900/50 text-lg"
                            >
                                <Play size={24} fill="currentColor" /> Start Audio Engine
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}