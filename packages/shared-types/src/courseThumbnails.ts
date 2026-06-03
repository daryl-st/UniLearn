/** Curated Unsplash covers keyed to UniLearn CS catalog (stable hotlink URLs). */
function unsplash(photoId: string): string {
    return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&h=450&q=80`;
}

/** Seeded catalog courses (see apps/backend/prisma/seed.ts). */
const THUMBNAIL_BY_CODE: Record<string, string> = {
    COSC4411: unsplash("photo-1677442136019-21780ecad995"), // Artificial Intelligence
    COSC3312: unsplash("photo-1558494949-ef010cbdcc31"), // Database Systems — data center
    COSC2210: unsplash("photo-1555066931-4365d14bab8c"), // Data Structures — code editor
    COSC1205: unsplash("photo-1516321318423-f06f85d504b3"), // Programming Fundamentals — laptop
    SENG2101: unsplash("photo-1522071820081-008f0129c71c"), // Software Engineering — team
    SENG3102: unsplash("photo-1498050108023-c5249f4df085"), // Web Application Development
    MATH1101: unsplash("photo-1635070041078-e36371c3ada4"), // Discrete Mathematics
    COSC3320: unsplash("photo-1544197150-b99a580bb7a8"), // Computer Networks
};

const THUMBNAIL_BY_TOPIC: Array<{ pattern: RegExp; url: string }> = [
    {
        pattern: /artificial intelligence|machine learning|neural|deep learning/i,
        url: THUMBNAIL_BY_CODE.COSC4411!,
    },
    {
        pattern: /database|sql|data warehouse|storage systems/i,
        url: THUMBNAIL_BY_CODE.COSC3312!,
    },
    {
        pattern: /data structure|algorithm|competitive programming/i,
        url: THUMBNAIL_BY_CODE.COSC2210!,
    },
    {
        pattern: /programming fundamental|intro to programming|computer programming/i,
        url: THUMBNAIL_BY_CODE.COSC1205!,
    },
    {
        pattern: /software engineering|software design|agile|devops/i,
        url: THUMBNAIL_BY_CODE.SENG2101!,
    },
    {
        pattern: /web application|web development|full[- ]?stack|frontend|backend development/i,
        url: THUMBNAIL_BY_CODE.SENG3102!,
    },
    {
        pattern: /discrete math|mathematics|linear algebra|calculus|statistics/i,
        url: THUMBNAIL_BY_CODE.MATH1101!,
    },
    {
        pattern: /computer network|networking|cybersecurity|distributed system/i,
        url: THUMBNAIL_BY_CODE.COSC3320!,
    },
    {
        pattern: /operating system|compiler|computer architecture|embedded/i,
        url: unsplash("photo-1518770660439-4636190af475"), // hardware / circuits
    },
    {
        pattern: /mobile|android|ios|flutter/i,
        url: unsplash("photo-1512941937669-90a1b58e7e9c"), // mobile devices
    },
];

const DEFAULT_COURSE_THUMBNAIL = unsplash("photo-1523240795612-9a054b0db644"); // university learning

export type CourseThumbnailInput = {
    code?: string | null;
    name?: string | null;
};

/**
 * Returns a thematic thumbnail URL for a course card or hero image.
 * Prefer `code` + `name`; do not pass database UUIDs (they won't match the catalog map).
 */
export function getCourseThumbnailUrl(input: CourseThumbnailInput): string {
    const code = input.code?.trim().toUpperCase();
    if (code && THUMBNAIL_BY_CODE[code]) {
        return THUMBNAIL_BY_CODE[code];
    }

    const name = input.name?.trim() ?? "";
    if (name) {
        for (const { pattern, url } of THUMBNAIL_BY_TOPIC) {
            if (pattern.test(name)) {
                return url;
            }
        }
    }

    if (code) {
        const codes = Object.keys(THUMBNAIL_BY_CODE);
        const index = hashString(code) % codes.length;
        return THUMBNAIL_BY_CODE[codes[index]!]!;
    }

    return DEFAULT_COURSE_THUMBNAIL;
}

function hashString(value: string): number {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = (hash * 31 + value.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
}
