import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import type { NextApiRequest, NextApiResponse } from 'next';

const BASE_URL = 'https://www.rundvandringar.se';

export default async (_req: NextApiRequest, res: NextApiResponse) => {
    const response = await fetch(`${BASE_URL}/downloads.html`);
    const text = await response.text();

    const dom = new JSDOM(text);
    const links = dom.window.document.getElementsByTagName('a');

    const allLinks: string[] = [];
    for (let i = 0; i < links.length; i += 1) {
        const { href } = links[i];

        if (href && href.includes('.gpx')) {
            allLinks.push(href);
        }
    }

    const allGpxTexts = await Promise.all(allLinks.map(getFile));

    res.status(200).json({ name: allLinks.join(',') });
};

async function getFile(path: string) {
    const response = await fetch(`${BASE_URL}/${path}`);
    const text = await response.text();

    return text;
}
