"use client"
export const Select = ({ options, onSelect }: {
    onSelect: (value: string) => void;
    options: {
        key: string;
        value: string;
    }[];
}) => {
    return <select onChange={(e) => {
        onSelect(e.target.value)
    }} className="bg-background border border-slate-700 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 transition-colors">
        {options.map(option => <option key={option.key} value={option.key} className="bg-surface">{option.value}</option>)}
    </select>
}