import { useEffect, useMemo, useState } from 'react'
import { api } from './api'

export default function CrudList({ collection, title }){
  const [schema, setSchema] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(()=>{
    (async()=>{
      try {
        const s = await api.schema()
        setSchema(s[collection])
        const list = await api.list(collection)
        setItems(list.items)
      } catch(e){
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [collection])

  const fields = useMemo(()=>{
    if(!schema) return []
    const props = schema.schema.properties || {}
    // order a bit
    const order = ['name','item_type','rarity','price','description']
    const keys = Object.keys(props)
    keys.sort((a,b)=>{
      const ai = order.indexOf(a)
      const bi = order.indexOf(b)
      if(ai===-1 && bi===-1) return a.localeCompare(b)
      if(ai===-1) return 1
      if(bi===-1) return -1
      return ai-bi
    })
    return keys
  }, [schema])

  function openNew(){
    setSelected(null)
    setFormData({})
  }

  function openEdit(item){
    setSelected(item.id)
    const { id, created_at, updated_at, ...rest } = item
    setFormData(rest)
  }

  function setValue(k, v){
    setFormData(prev=>({ ...prev, [k]: v }))
  }

  async function save(){
    try{
      if(selected){
        await api.update(collection, selected, formData)
      } else {
        await api.create(collection, formData)
      }
      const list = await api.list(collection)
      setItems(list.items)
      setSelected(null)
      setFormData({})
    } catch(e){
      alert(e.message)
    }
  }

  async function remove(id){
    if(!confirm('Delete this item?')) return
    await api.remove(collection, id)
    const list = await api.list(collection)
    setItems(list.items)
  }

  if(loading) return <div className="text-slate-300">Loading...</div>
  if(error) return <div className="text-red-400">{error}</div>
  if(!schema) return <div className="text-yellow-400">No schema found for {collection}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button onClick={openNew} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm">Add New</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-slate-300">
                <tr>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(it=> (
                  <tr key={it.id} className="border-t border-slate-800 hover:bg-slate-800/40">
                    <td className="p-2">{it.name || it.title || it.activity_key || 'Untitled'}</td>
                    <td className="p-2 font-mono text-xs opacity-70">{it.id}</td>
                    <td className="p-2">
                      <button onClick={()=>openEdit(it)} className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
                      <button onClick={()=>remove(it.id)} className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <h2 className="font-semibold mb-3">{selected ? 'Edit' : 'Create'} {title}</h2>
          <Form fields={fields} schema={schema} data={formData} onChange={setValue} />
          <div className="mt-4 flex gap-2">
            <button onClick={save} className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm">Save</button>
            <button onClick={()=>{setSelected(null); setFormData({})}} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Form({ fields, schema, data, onChange }){
  const props = schema.schema.properties || {}
  return (
    <div className="space-y-3">
      {fields.map((key)=>{
        const def = props[key]
        if(!def) return null
        const type = def.type
        const format = def.format
        const value = data[key] ?? ''

        // Simple editors for primitives; nested objects shown as JSON
        if(type === 'integer' || type === 'number'){
          return (
            <Field key={key} label={key}>
              <input type="number" value={value} onChange={e=>onChange(key, Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2" />
            </Field>
          )
        }
        if(type === 'boolean'){
          return (
            <Field key={key} label={key}>
              <select value={String(value)} onChange={e=>onChange(key, e.target.value === 'true')} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2">
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </Field>
          )
        }
        if(type === 'string' && def.enum){
          return (
            <Field key={key} label={key}>
              <select value={value} onChange={e=>onChange(key, e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2">
                {def.enum.map((opt)=> <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </Field>
          )
        }
        if(type === 'string'){
          const isLong = (key === 'description')
          return (
            <Field key={key} label={key}>
              {isLong ? (
                <textarea value={value} onChange={e=>onChange(key, e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 h-24" />
              ) : (
                <input value={value} onChange={e=>onChange(key, e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2" />
              )}
            </Field>
          )
        }

        // Fallback JSON editor
        return (
          <Field key={key} label={key}>
            <textarea value={JSON.stringify(value, null, 2)} onChange={e=>{
              try{ onChange(key, JSON.parse(e.target.value)) } catch(err){ /* ignore */ }
            }} className="w-full font-mono text-xs bg-slate-800 border border-slate-700 rounded px-3 py-2 h-40" />
          </Field>
        )
      })}
    </div>
  )
}

function Field({ label, children }){
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">{label}</label>
      {children}
    </div>
  )
}
