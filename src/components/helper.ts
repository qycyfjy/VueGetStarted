import CFB from 'cfb';


export const fixString = (x: string) => {
    return x.replace(/[\u0000-\u001f]/, function (match) {
        return `\\u${("0000" + match.charCodeAt(0).toString(16)).slice(-4)}`;
    });
};

export const hexDump = (arrayBuffer: ArrayBuffer) => {
    const view = new Uint8Array(arrayBuffer);
    let dump = '';
    let address = 0;

    for (let i = 0; i < view.length; i += 16) {
        const bytes = view.slice(i, i + 16);

        const hexBytes = Array.from(bytes)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join(' ');

        const asciiBytes = Array.from(bytes)
            .map(byte => {
                const char = String.fromCharCode(byte);
                return byte >= 32 && byte <= 126 ? char : '.';
            })
            .join('');
        dump += `${address.toString(16).padStart(8, '0')}: ${hexBytes.padEnd(47, ' ')}\t${asciiBytes}\n`
        address += 16;
    }

    return dump;
}

const typedArrayToBuffer = (array: Uint8Array): ArrayBuffer => {
    return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset)
}

export const a2ab = (a: CFB.CFB$Blob) => {
    if (a instanceof Uint8Array) {
        return typedArrayToBuffer(a);
    }
    let o = new ArrayBuffer(a.length);
    let view = new Uint8Array(o);
    for (let i = 0; i < a.length; i++) {
        view[i] = a[i];
    }
    return o;
}