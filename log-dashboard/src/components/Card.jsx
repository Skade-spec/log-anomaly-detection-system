export default function Card({ title, children }) {
  return (
    <div className="bg-white rounded shadow p-4">
      {title && <h3 className="text-sm font-medium mb-2">{title}</h3>}
      {children}
    </div>
  );
}
