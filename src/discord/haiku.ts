import { syllablize } from "fast-syllablize";

const UrlPattern = /https?:\/\/(?:www\.)?[-A-Z0-9@:%._\+~#=]{1,256}(?:\.[A-Z0-9()]{1,6})?\b(?:[-A-Z0-9()@:%_\+.~#?&\/=]*)/i;
const NonWordPattern = /((?:<?(a)?:?(\w{2,32}):(\d{17,19})>?)|[^A-Z]+)/i;

export function haikuable(content: string): boolean {
    return !UrlPattern.test(content);
}

export function formatHaiku(content: string): string | null {
    const lines = [new HaikuLine(5)];
    const chars = content
        .split(NonWordPattern)
        .filter(item => typeof item === "string");
    for (let i = 0; i < chars.length; i++) {
        const line = lines[lines.length - 1];
        if (chars[i] && !line.append(chars[i], !(i & 1))) {
            if (line.over) {
                return null;
            }
            else if (lines.length < 3) {
                lines.push(new HaikuLine(lines.length & 1 ? 7 : 5));
            }
        }
    }
    return lines.length === 3 ? lines.join("\n") : null;
}

class HaikuLine {
    private _line: string;
    private _syllables: number;

    constructor(private max: number) {
        this._line = "";
        this._syllables = 0;
    }

    get syllables(): number {
        return this._syllables;
    }

    get over(): boolean {
        return this._syllables > this.max;
    }

    append(str: string, word: boolean): boolean {
        this._line += str;
        if (word) {
            const { length: syllables } = syllablize(str);
            this._syllables += syllables;
        }
        return this._syllables < this.max;
    }

    toString(): string {
        return this._line.trim();
    }
}
