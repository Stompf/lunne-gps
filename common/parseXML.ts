// https://www.scriptol.com/javascript/xml-to-object.php

/* eslint-disable no-plusplus, no-restricted-syntax, guard-for-in */
import sax from 'sax';

export function parseXML(named: string, data: string) {
    const parser = sax.parser(true, { trim: true });
    parser.onerror = (e) => {
        // eslint-disable-next-line no-console
        console.log('XML error: ', named, e.toString());
        return {};
    };

    let cTag: any = null;
    let xmlRoot: any = null;

    parser.ontext = (t) => {
        if (cTag && t.length > 0) {
            cTag.data = t;
        }
    };

    parser.onopentag = (node) => {
        const { name } = node;
        const parent = cTag;
        cTag = {};
        cTag.array = [];
        cTag.idFlag = false; // same tags at same level
        if (xmlRoot === null) {
            xmlRoot = {};
            xmlRoot[name] = cTag;
        } else {
            cTag.parent = parent;
            const xTag: Record<string, any> = {};
            xTag[name] = cTag;
            parent.array.push(xTag);
        }

        for (const k in node.attributes) {
            cTag[k] = node.attributes[k];
        }

        while (parent && !parent.idFlag) {
            for (let i = 0; i < parent.array.length - 1; i++) {
                const elem = parent.array[i];
                for (const key in elem) {
                    if (key === name) parent.idFlag = true;
                    break;
                }
            }
            break;
        }
    };

    parser.onclosetag = () => {
        if (cTag.idFlag === false) {
            // only one child / all child's different
            for (let i = 0; i < cTag.array.length; i++) {
                const xTag = cTag.array[i];
                for (const u in xTag) {
                    cTag[u] = xTag[u];
                }
            }
            delete cTag.array;
        }
        delete cTag.idFlag;
        if (cTag.parent) {
            const { parent } = cTag;
            delete cTag.parent;
            cTag = parent;
        }
    };

    parser.write(data).end();
    return xmlRoot;
}
