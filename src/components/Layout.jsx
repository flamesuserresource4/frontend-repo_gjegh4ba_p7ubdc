import { useEffect, useState } from 'react'
import { Menu, Settings, Database, Package, Sword, Shield, Map, Crown, Image, Trophy } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const nav = [
  { label: 'Items', to: '/items', icon: Package },
  { label: 'Loot Tables', to: '/loottables', icon: TreasureIcon },
  { label: 'Expeditions', to: '/expeditions', icon: Map },
  { label: 'Titles', to: '/titles', icon: Crown },
  { label: 'Backgrounds', to: '/backgrounds', icon: Image },
  { label: 'Activity Rewards', to: '/activityrewards', icon: Trophy },
]

function TreasureIcon(props){
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gift"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M12 7v14"/><path d="M2 12h20"/><path d="M12 7H7.5A2.5 2.5 0 1 1 10 4c0 1-1 3-3 3"/><path d="M12 7h4.5A2.5 2.5 0 1 0 14 4c0 1 1 3 3 3"/></svg>
  )
}

export default function Layout({ children }) {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900/80 backdrop-blur border-r border-slate-800 p-4 space-y-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600" />
          <div>
            <div className="font-bold">RPG Admin</div>
            <div className="text-xs text-slate-400">Discord Bot</div>
          </div>
        </div>
        {nav.map((n)=>{
          const active = location.pathname.startsWith(n.to)
          const Icon = n.icon
          return (
            <Link key={n.to} to={n.to} className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition ${active ? 'bg-slate-800 text-white' : 'text-slate-300'}`}>
              <Icon className="w-4 h-4" />
              <span className="text-sm">{n.label}</span>
            </Link>
          )
        })}
      </aside>
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
