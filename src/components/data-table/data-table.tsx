import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Button } from '../ui/button'

type Column<T> = { key: string; header: string; render: (row: T) => ReactNode }
type DataTableProps<T> = { columns: Column<T>[]; data: T[]; rowKey: (row: T) => string; search?: string; onSearch?: (value: string) => void; filter?: ReactNode; totalLabel?: string; emptyMessage?: string }

export function DataTable<T>({ columns, data, rowKey, search, onSearch, filter, totalLabel, emptyMessage = 'Chưa có dữ liệu phù hợp.' }: DataTableProps<T>) {
  return <div className="card"><div className="table-toolbar"><div className="toolbar-controls">{onSearch && <label className="search-box" style={{ width: 'min(320px, 100%)' }}><Search className="search-icon" size={16} aria-hidden="true" /><input value={search} onChange={(event) => onSearch(event.target.value)} aria-label="Tìm trong bảng" placeholder="Tìm kiếm..." /></label>}{filter}</div><Button variant="secondary" size="sm">Bộ lọc</Button></div>{data.length === 0 ? <div className="empty-state"><strong>{emptyMessage}</strong><span>Thử thay đổi từ khóa hoặc bộ lọc.</span></div> : <><div className="table-wrap"><table className="data-table"><thead><tr>{columns.map((column) => <th key={column.key} scope="col">{column.header}</th>)}</tr></thead><tbody>{data.map((row) => <tr key={rowKey(row)}>{columns.map((column) => <td key={column.key}>{column.render(row)}</td>)}</tr>)}</tbody></table></div><div className="table-footer"><span>{totalLabel ?? `${data.length} bản ghi`}</span><div className="pagination"><button className="icon-button" type="button" aria-label="Trang trước" disabled><ChevronLeft size={16} /></button><button className="icon-button" type="button" aria-label="Trang sau" disabled><ChevronRight size={16} /></button></div></div></>}</div>
}
