import summaryCompanies from '@/data/summary_companies.json';

export function EmpresaSelect({ selected, onChange }: { selected: string, onChange: (id: string) => void }) {
  return (
    <select
      className="border rounded px-3 py-2 text-sm"
      value={selected}
      onChange={e => onChange(e.target.value)}
    >
      {summaryCompanies.map((empresa: any) => (
        <option key={empresa.empresa_id} value={empresa.empresa_id}>
          {empresa.empresa_id}
        </option>
      ))}
    </select>
  );
}
