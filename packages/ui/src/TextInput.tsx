"use client"

export const TextInput = ({
    placeholder,
    onChange,
    label
}: {
    placeholder: string;
    onChange: (value: string) => void;
    label: string;
}) => {
    return <div className="pt-2">
        <label className="block mb-2 text-sm font-medium text-gray-200">{label}</label>
        <input onChange={(e) => onChange(e.target.value)} type="text" id="first_name" className="bg-background border border-slate-700 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 transition-colors" placeholder={placeholder} />
    </div>
}