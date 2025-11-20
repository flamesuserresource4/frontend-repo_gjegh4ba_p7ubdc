import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import CrudList from './components/CrudList'

function Home(){
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Welcome to your RPG Admin</h1>
      <p className="text-slate-300">Use the left menu to manage items, loot tables, expeditions, titles, backgrounds, and activity rewards.</p>
    </div>
  )
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<CrudList collection="item" title="Items" />} />
        <Route path="/loottables" element={<CrudList collection="loottable" title="Loot Tables" />} />
        <Route path="/expeditions" element={<CrudList collection="expedition" title="Expeditions" />} />
        <Route path="/titles" element={<CrudList collection="title" title="Titles" />} />
        <Route path="/backgrounds" element={<CrudList collection="background" title="Backgrounds" />} />
        <Route path="/activityrewards" element={<CrudList collection="activityreward" title="Activity Rewards" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
