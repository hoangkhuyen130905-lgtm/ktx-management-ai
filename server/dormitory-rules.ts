export type DormitoryRuleStatus = 'demo' | 'draft' | 'approved'

export type DormitoryRuleSection = {
  id: string
  title: string
  keywords: string[]
  guidance: string[]
}

export const dormitoryRules = {
  sourceId: 'ktx-ictu-rules-demo',
  title: 'Nội quy KTX ICTU',
  version: 'demo-2026.08',
  status: 'demo' as DormitoryRuleStatus,
  effectiveDate: null as string | null,
  lastReviewedAt: '2026-08-20',
  contact: 'Ban quản lý KTX',
  notice: '',
  sections: [
    { id: 'quiet-hours', title: 'Giờ yên tĩnh', keywords: ['giờ yên tĩnh', 'yên tĩnh', 'tiếng ồn', 'ồn', 'nghỉ ngơi'], guidance: ['Giữ âm lượng vừa phải tại phòng ở và khu vực chung, đặc biệt vào thời gian nghỉ ngơi.', 'Không mở loa lớn hoặc gây tiếng ồn ảnh hưởng đến sinh viên khác.', 'Trường hợp cần tổ chức hoạt động đặc biệt, hãy liên hệ Ban quản lý để được hướng dẫn trước.'] },
    { id: 'cleanliness', title: 'Vệ sinh và khu vực chung', keywords: ['vệ sinh', 'rác', 'khu vực chung', 'sạch sẽ', 'phòng ở'], guidance: ['Giữ phòng ở, hành lang và khu vực chung sạch sẽ.', 'Bỏ rác đúng nơi quy định; không để vật dụng cản trở lối đi và lối thoát hiểm.', 'Báo sự cố vệ sinh hoặc hư hỏng qua chức năng yêu cầu hỗ trợ.'] },
    { id: 'fire-safety', title: 'An toàn và phòng cháy', keywords: ['phòng cháy', 'cháy', 'an toàn', 'bình chữa cháy', 'lối thoát hiểm'], guidance: ['Không che chắn, khóa hoặc đặt đồ tại lối thoát hiểm.', 'Không tự ý sử dụng thiết bị, nguồn điện hoặc vật dụng có nguy cơ gây cháy nổ trái hướng dẫn.', 'Khi phát hiện dấu hiệu nguy hiểm, rời khỏi khu vực nếu cần và báo ngay cho Ban quản lý.'] },
    { id: 'visitors', title: 'Khách thăm', keywords: ['khách', 'khách thăm', 'người thân', 'thăm phòng', 'ra vào'], guidance: ['Khách thăm cần tuân thủ quy trình đăng ký và thời gian tiếp khách do KTX thông báo.', 'Sinh viên chịu trách nhiệm nhắc khách giữ trật tự, vệ sinh và an toàn trong khu vực KTX.', 'Nếu chưa rõ quy trình hoặc thời gian áp dụng, liên hệ Ban quản lý để xác nhận.'] },
    { id: 'property', title: 'Bảo vệ tài sản', keywords: ['tài sản', 'mất đồ', 'tủ khóa', 'đồ đạc', 'an ninh'], guidance: ['Tự bảo quản tài sản cá nhân và khóa phòng/tủ theo hướng dẫn.', 'Không tự ý di chuyển, tháo lắp hoặc làm hỏng tài sản, thiết bị của KTX.', 'Báo sớm cho Ban quản lý khi phát hiện mất mát hoặc hư hỏng.'] },
    { id: 'incidents', title: 'Báo sự cố và hỗ trợ', keywords: ['sự cố', 'hỗ trợ', 'bảo trì', 'hỏng', 'báo cáo'], guidance: ['Mô tả rõ vị trí, tình trạng và mức độ ảnh hưởng khi gửi yêu cầu.', 'Sự cố khẩn cấp cần được báo trực tiếp cho Ban quản lý theo kênh chính thức của KTX.', 'AI chỉ cung cấp thông tin tham khảo, không thay thế quyết định của nhân viên vận hành.'] },
  ] as DormitoryRuleSection[],
} as const

export function getDormitoryRules(input: { topic?: string } = {}) {
  const topic = input.topic?.trim().toLowerCase()
  const asksForAllRules = !topic || ['nội quy', 'quy định', 'ký túc xá', 'kí túc xá', 'ktx'].some((keyword) => topic.includes(keyword))
  const sections = asksForAllRules ? dormitoryRules.sections : dormitoryRules.sections.filter((section) => [section.title, ...section.keywords].some((keyword) => topic.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(topic)))
  return { source: { id: dormitoryRules.sourceId, label: dormitoryRules.title, version: dormitoryRules.version, status: dormitoryRules.status, effectiveDate: dormitoryRules.effectiveDate }, notice: dormitoryRules.notice, contact: dormitoryRules.contact, sections: sections.slice(0, 6), notCovered: topic && !asksForAllRules && sections.length === 0 ? `Chưa có mục nội quy phù hợp với chủ đề: ${input.topic}.` : undefined }
}
