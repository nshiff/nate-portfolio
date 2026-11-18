import { Link } from 'react-router';

export function Project24() {
    return (
        <main style={{ flex: 1, padding: '2rem 0' }}>
            <div className="container">
                <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    &larr; Back to Portfolio
                </Link>

                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '60vh',
                        minHeight: '400px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        marginBottom: '3rem',
                        overflow: 'hidden',
                    }}>
                    <iframe
                        src="/demo/fluid-simulation.html"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                        }}
                        title="Stable Fluids 2.0 Demo"
                    />
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Stable Fluids 2.0</h1>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>WebGL</span>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Mobile-first</span>
                </div>

                <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
                    <p><a href="https://github.com/nshiff/nate-portfolio/blob/main/public/demo/fluid-simulation.html" target="_blank" rel="noopener noreferrer">Source code</a></p>
                    <p>
                        A revisit of <Link to="/project/01">Project 1</Link>, rebuilt from the ground up for mobile devices. Instead of
                        solving Navier-Stokes on the CPU with p5.js, this version runs the entire stable-fluids solver on the GPU
                        with WebGL fragment shaders: vorticity confinement, pressure projection, and semi-Lagrangian advection of
                        both velocity and dye.
                    </p>
                    <p>
                        Mobile-friendliness is designed in rather than bolted on: pointer events drive multi-touch splats,
                        device pixel ratio is capped to keep fill rate sane, rendering pauses when the tab is hidden to save
                        battery, and an adaptive quality controller watches frame times and steps the simulation and dye
                        texture resolutions up or down to hold a smooth frame rate on weaker GPUs.
                    </p>
                    <p>
                        Touch and drag — a finger per swirl works too — to stir the fluid.
                    </p>
                    <p>
                        This project was created using AI-assisted development with <a href="https://mistral.ai" target="_blank" rel="noopener noreferrer">Vibe Code</a>.
                    </p>
                </div>
            </div>
        </main>
    );
}
