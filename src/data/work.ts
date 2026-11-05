export const work = {
    heading: 'MY WORK',
    intro: 'Production systems, infrastructure tools, and open-source projects I have built or contributed to.',
    work: [
        {
            id: '#001',
            status: 'Current',
            type: 'Backend / ERP',
            title: 'Bomach Group',
            description:
                "I develop and improve an internal ERP at Bomach Group, helping streamline business operations and financial processes. I'm also modernizing its legacy Django codebase into a modular system, with improved access control and reporting across business units.",
            tags: ['Python', 'Django Ninja', 'PostgreSQL', 'Testing'],
        },
        {
            id: '#002',
            status: 'CNCF',
            type: 'Open source',
            title: 'Lima',
            href: 'https://github.com/lima-vm/lima',
            description:
                'Contributed Go fixes and improvements to the CNCF project for running Linux virtual machines and containers, including Windows Joliet ISO generation, limactl-menu navigation shortcuts, shellword parsing, and menu behavior.',
            tags: ['Go', 'Linux', 'Open source'],
        },
        {
            id: '#003',
            status: 'Built',
            type: 'Systems',
            title: 'govisor',
            href: 'https://github.com/deltron-fr/govisor',
            description:
                'A Linux process supervisor driven by YAML, with a CLI and client-server interface over Unix domain sockets for configuration, status, logs, and controlled shutdown.',
            tags: ['Go', 'Linux', 'Unix sockets'],
        },
        {
            id: '#004',
            status: 'Built',
            type: 'Systems',
            title: 'gash',
            href: 'https://github.com/deltron-fr/dshell',
            description:
                'An interactive Unix-like shell in Go with builtins, pipelines, redirection, command history, tab completion, background jobs, and shell parameter expansion.',
            tags: ['Go', 'Shell internals', 'Terminal I/O'],
        },
        {
            id: '#005',
            status: 'Built',
            type: 'Networking',
            title: 'Warden',
            href: 'https://github.com/deltron-fr/warden',
            description:
                'An HTTP/1.1 reverse proxy in Go with TCP request handling, path-based routing, round-robin upstreams, YAML configuration, and graceful shutdown.',
            tags: ['Go', 'TCP/IP', 'HTTP/1.1'],
        },
        {
            id: '#006',
            status: 'Built',
            type: 'Backend',
            title: 'Simila',
            href: 'https://github.com/Parakliite/Simila-backend',
            description:
                'Built the Go backend for a social taste app, including authentication, PostgreSQL data modeling, typed sqlc queries, OpenAPI documentation, endpoint tests, and CI.',
            tags: ['Go', 'PostgreSQL', 'sqlc', 'OpenAPI'],
        },
        {
            id: '#007',
            status: 'Built',
            type: 'AI infrastructure',
            title: 'MIRA',
            href: 'https://github.com/jerrygeorge360/mira',
            description:
                'Co-built inspectable memory infrastructure for AI agents, with structured response handling, traceability, Slack integration, Docker deployment, CI/CD, and Nginx routing.',
            tags: ['Python', 'Slack Bolt', 'Docker', 'CI/CD'],
        },
    ],
} as const;
