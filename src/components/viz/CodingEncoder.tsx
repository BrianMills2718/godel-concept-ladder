/**
 * Interactive Gödel-coding encoder. The learner edits a short exponent sequence
 * and sees it become a single number via prime powers 2^a · 3^b · 5^c · …, then
 * watches the unique factorization decode it back. Uses BigInt so the products
 * (which explode fast) stay exact.
 *
 * Pedagogy: this makes "arithmetization of syntax" tangible — a *sequence*
 * becomes one *number*, recoverable because factorization is unique. It is
 * illustrative, not an efficient real numbering.
 */
import { useMemo, useState } from "react";
import type { CodingEncoderViz } from "../../types";
import { Tex } from "../Math";

const PRIMES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n];

function encode(seq: number[]): bigint {
  return seq.reduce<bigint>((acc, e, i) => acc * PRIMES[i] ** BigInt(Math.max(0, e)), 1n);
}

/** Recover the exponents by dividing out each prime — the decode step. */
function decode(n: bigint, len: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < len; i++) {
    let e = 0;
    let m = n;
    while (m % PRIMES[i] === 0n) {
      m /= PRIMES[i];
      e++;
    }
    out.push(e);
  }
  return out;
}

export function CodingEncoder({ viz }: { viz: CodingEncoderViz }) {
  const [seq, setSeq] = useState<number[]>(viz.defaultSequence);

  const product = useMemo(() => encode(seq), [seq]);
  const decoded = useMemo(() => decode(product, seq.length), [product, seq.length]);

  const powerTex = seq
    .map((e, i) => `${PRIMES[i]}^{${e}}`)
    .join(" \\cdot ");

  function setAt(i: number, v: string) {
    const n = Math.max(0, Math.min(40, parseInt(v || "0", 10) || 0));
    setSeq((s) => s.map((x, j) => (j === i ? n : x)));
  }
  function add() {
    if (seq.length < PRIMES.length) setSeq((s) => [...s, 1]);
  }
  function remove() {
    if (seq.length > 1) setSeq((s) => s.slice(0, -1));
  }

  return (
    <div className="coding-encoder" role="group" aria-label={viz.textualSummary}>
      <div className="ce-seq">
        <span className="ce-label">sequence:</span>
        {seq.map((e, i) => (
          <span className="ce-cell" key={i}>
            <span className="ce-prime">{String(PRIMES[i])}^</span>
            <input
              type="number"
              min={0}
              max={40}
              value={e}
              onChange={(ev) => setAt(i, ev.target.value)}
              aria-label={`exponent ${i + 1} (power of ${PRIMES[i]})`}
            />
          </span>
        ))}
        <button className="ce-btn" onClick={add} disabled={seq.length >= PRIMES.length} title="add element">＋</button>
        <button className="ce-btn" onClick={remove} disabled={seq.length <= 1} title="remove last">－</button>
      </div>

      <div className="ce-eq">
        <Tex block>{`\\text{code}([${seq.join(",")}]) = ${powerTex}`}</Tex>
      </div>

      <div className="ce-product">
        <span className="ce-label">single number:</span>
        <code className="ce-number">{product.toString()}</code>
      </div>

      <div className="ce-decode">
        <span className="ce-label">decode (divide out each prime):</span>{" "}
        recovered exponents <code>[{decoded.join(", ")}]</code>{" "}
        {decoded.join(",") === seq.join(",") ? (
          <span className="ce-ok">✓ matches — unique factorization</span>
        ) : (
          <span className="ce-bad">mismatch</span>
        )}
      </div>

      <p className="ce-note">
        The number doesn't “know” it codes a sequence — the coding scheme is fixed
        externally. Inside arithmetic, a separate formula <em>represents</em> the
        decoding relation.
      </p>
    </div>
  );
}
