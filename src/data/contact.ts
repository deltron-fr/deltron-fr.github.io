export const contact = {
    heading: 'CONTACT',
    intro: 'For hiring, collaboration, or a conversation about backend and systems work, email me directly or follow the code on GitHub.',
    cta: {
        label: 'Available',
        title: "Let's build reliable systems",
        href: 'mailto:kelechiogbonnaya2020@gmail.com',
        description:
            'I am open to backend, systems, infrastructure, and platform engineering opportunities.',
    },
    resume: {
        intro: 'A single resume with the systems, backend, infrastructure, and open-source experience most relevant to the work I want to do.',
        href: '/resume/',
        title: 'Systems and backend engineer',
        description: 'View my experience, selected Lima contributions, projects, skills, education, and certifications.',
        options: [
            {
                title: 'Systems and backend engineer',
                href: '/resume/',
                description: 'View my experience, selected Lima contributions, projects, skills, education, and certifications.',
            },
        ],
    },
    channels: [
        {
            label: 'Email',
            href: 'mailto:kelechiogbonnaya2020@gmail.com',
            value: 'kelechiogbonnaya2020@gmail.com',
            description:
                'For hiring, collaboration, and anything better sent directly.',
        },
        {
            label: 'GitHub',
            href: 'https://github.com/deltron-fr',
            value: '@deltron-fr',
            description:
                'Projects, contributions, and the systems work behind this portfolio.',
        },
        {
            label: 'Discord',
            href: 'https://discord.com/app',
            value: 'deltronfr',
            description:
                'Find me on Discord as deltronfr.',
        },
    ],
} as const;
