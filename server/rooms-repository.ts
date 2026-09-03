import { rooms } from '../src/data/mock/fixtures.ts'
import type { Room, RoomStatus } from '../src/lib/types.ts'

export type RoomLookupInput = {
  building?: string
  gender?: 'Nam' | 'Nữ'
  status?: RoomStatus
  onlyAvailable?: boolean
  capacity?: number
}

export function lookupRooms(input: RoomLookupInput): Room[] {
  return rooms.filter((room) => {
    if (input.building && room.building !== input.building) return false
    if (input.gender && room.gender !== input.gender) return false
    if (input.status && room.status !== input.status) return false
    if (input.capacity && room.capacity < input.capacity) return false
    if (input.onlyAvailable && (room.status === 'full' || room.status === 'maintenance' || room.occupied >= room.capacity)) return false
    return true
  }).slice(0, 20)
}
