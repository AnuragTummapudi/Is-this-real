export default function Cursor({ dotRef, ringRef, enabled }) {
  if (!enabled) {
    return null;
  }

  return (
    <>
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}
