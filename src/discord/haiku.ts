import { syllablize } from "fast-syllablize";
import { Entry, getDict } from "node-cmudict";

const UrlPattern = /https?:\/\/(?:www\.)?[-A-Z0-9@:%._\+~#=]{1,256}(?:\.[A-Z0-9()]{1,6})?\b(?:[-A-Z0-9()@:%_\+.~#?&\/=]*)/i;
const NonWordPattern = getNonWordPattern();
const WordPattern = /[A-Z]+/gi;
const Dict = getDict();

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

function getNonWordPattern(): RegExp {
    const symbolPattern = /[^A-Z]/gi;
    const symbols = new Set<string>();
    for (const entry of Dict.values()) {
        const entrySymbols = entry.name.match(symbolPattern);
        entrySymbols?.forEach(symbol => symbols.add(symbol));
    }
    const dictSymbols = Array
        .from(symbols)
        .join("");
    return new RegExp(`((?:<?(a)?:?(\\w{2,32}):(\\d{17,19})>?)|(?<![A-Z])[${dictSymbols}]+(?![A-Z])|[^A-Z${dictSymbols}]+)`, "i");
}

function countEntrySyllables(entry: Entry): number {
    return entry.pronunciations[0].phonemes.reduce((count, phoneme) => {
        if (phoneme.stress !== null) {
            count++;
        }
        return count;
    }, 0);
}

function countSyllables(word: string): number {
    let entry = Dict.get(word);
    if (entry && entry.pronunciations.length) {
        return countEntrySyllables(entry);
    }
    else {
        const strict = word.match(WordPattern)!;
        return strict.reduce((count, str) => {
            entry = Dict.get(str);
            if (entry && entry.pronunciations.length) {
                count += countEntrySyllables(entry);
            }
            else {
                const { length } = syllablize(str);
                count += length;
            }
            return count;
        }, 0);
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
            this._syllables += countSyllables(str.toLowerCase());
        }
        return this._syllables < this._max;
    }

    toString(): string {
        const trimmed = this._line.trim();
        return trimmed[0].toUpperCase() + trimmed.slice(1);
    }
}
