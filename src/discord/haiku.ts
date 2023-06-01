import { syllablize } from "fast-syllablize";
import { Dict } from "node-cmudict";

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
                if (chars[i++]) {
                    line.append(chars[i], false);
                }
                lines.push(new HaikuLine(lines.length & 1 ? 7 : 5));
            }
        }
    }
    return lines.length === 3 && lines.every(line => line.valid) ? lines.join("\n") : null;
}

function countSyllables(word: string): number {
    const entry = Dict.get(word);
    if (entry && entry.pronunciations.length) {
        return entry.pronunciations[0].phonemes.reduce((count, phoneme) => {
            if (phoneme.stress !== null) {
                count++;
            }
            return count;
        }, 0);
    }
    else {
        const { length } = syllablize(word);
        return length;
    }
}

class HaikuLine {
    private _line: string;
    private _syllables: number;

    constructor(private _max: number) {
        this._line = "";
        this._syllables = 0;
    }

    get syllables(): number {
        return this._syllables;
    }

    get valid(): boolean {
        return this._syllables === this._max;
    }

    get over(): boolean {
        return this._syllables > this._max;
    }

    append(str: string, word: boolean): boolean {
        this._line += str;
        if (word) {
            this._syllables += countSyllables(str);
        }
        return this._syllables < this._max;
    }

    toString(): string {
        const trimmed = this._line.trim();
        return trimmed[0].toUpperCase() + trimmed.slice(1);
    }
}
