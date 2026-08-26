/** Squelette affiché pendant la navigation entre pages. */
export default function Loading() {
  return (
    <div className="container-page py-14">
      <div className="skeleton h-4 w-24 rounded-xs" />
      <div className="skeleton mt-5 h-12 w-2/3 max-w-md rounded-sm" />
      <div className="skeleton mt-4 h-4 w-full max-w-xl rounded-xs" />

      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="skeleton aspect-4/5 rounded-lg" />
            <div className="skeleton h-4 w-2/3 rounded-xs" />
            <div className="skeleton h-4 w-1/3 rounded-xs" />
          </div>
        ))}
      </div>
    </div>
  );
}
