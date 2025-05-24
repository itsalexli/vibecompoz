// lib/convertAbcToMusicXml.ts

import { parseOnly, TuneObject } from "abcjs";
import { create } from "xmlbuilder2";

// semitone → MusicXML step letter (ignoring accidentals)
const SEMITONE_TO_STEP = [
  "C",
  "C",
  "D",
  "D",
  "E",
  "F",
  "F",
  "G",
  "G",
  "A",
  "A",
  "B",
];
// which semitones are “sharped” (i.e. black keys) if you needed to compute accidentals
const SHARP_SEMITONES = new Set([1, 3, 6, 8, 10]);

// map ABC “length” units → MusicXML <type>
const DURATION_TYPE: Record<number, string> = {
  4: "whole",
  2: "half",
  1: "quarter",
  0.5: "eighth",
  0.25: "16th",
};

function getNoteType(duration: number): string {
  const keys = Object.keys(DURATION_TYPE)
    .map(Number)
    .sort((a, b) => b - a);
  for (const k of keys) {
    if (Math.abs(duration - k) < 1e-6) return DURATION_TYPE[k];
  }
  return "quarter";
}

export function convertAbcToMusicXml(abcText: string): string {
  const tunes = parseOnly(abcText);
  if (!tunes.length) throw new Error("No tune parsed from ABC.");
  const tune: TuneObject = tunes[0];

  // 1. Start MusicXML document
  const xmlRoot = create({ version: "1.0", encoding: "UTF-8" }).ele(
    "score-partwise",
    {
      version: "3.1",
      xmlns: "http://www.musicxml.org/ns/musicxml",
    }
  );

  // 2. Part list
  xmlRoot
    .ele("part-list")
    .ele("score-part", { id: "P1" })
    .ele("part-name")
    .txt(tune.metaText?.title || "Music")
    .up()
    .up()
    .up();

  // 3. Single part
  const part = xmlRoot.ele("part", { id: "P1" });

  // 4. Iterate measures & notes
  let measureCount = 1;
  for (const line of tune.lines) {
    if (!line.staff) continue;
    for (const staffGroup of line.staff) {
      const measure = part.ele("measure", { number: String(measureCount++) });

      for (const voice of staffGroup.voices || []) {
        for (const el of voice) {
          if (el.el_type !== "note") continue;

          const note = measure.ele("note");
          // Rest?
          if (el.rest) {
            note.ele("rest");
            continue;
          }

          // Pitched note
          if (el.pitches?.length) {
            const p = el.pitches[0];
            const pitch = note.ele("pitch");

            // get step: use provided letter or derive from semitone
            const semitone = ((p.pitch % 12) + 12) % 12;
            const stepLetter = p.pitchLetter
              ? p.pitchLetter.toUpperCase()
              : SEMITONE_TO_STEP[semitone];
            pitch.ele("step").txt(stepLetter);

            // optional <alter> if there was an accidental in the ABC
            if (p.accidental) {
              // could be '#' or 'b'
              pitch.ele("alter").txt(p.accidental === "#" ? "1" : "-1");
            } else if (SHARP_SEMITONES.has(semitone)) {
              // if you want to mark accidentals even when ABC omitted them,
              // uncomment the next line:
              // pitch.ele('alter').txt('1');
            }

            // octave
            pitch.ele("octave").txt(String(p.octave));
          }

          // duration & type
          note.ele("duration").txt(String(el.duration));
          note.ele("type").txt(getNoteType(el.duration));
        }
      }
    }
  }

  // 5. Finish up
  return xmlRoot.end({ prettyPrint: true });
}
