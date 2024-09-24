const spreadsheetUrl = ''

const times = [
  { start: '19:00:00', end: '21:00:00' },
  { start: '19:00:00', end: '21:00:00' },
  { start: '19:00:00', end: '21:00:00' },
  // { start: '14:00:00', end: '16:00:00' },
  // { start: '19:00:00', end: '21:00:00' },
]

function useVars() {
  const spreadSheet = SpreadsheetApp.openByUrl(spreadsheetUrl)
  const sheet = spreadSheet.getSheetByName('規劃表')

  const last_row = sheet.getLastRow()

  const class_names_data = sheet.getRange('A1:N1').getValues()
  const class_names = times.map((_, i) => class_names_data[0][4 + i * 2])

  const range = sheet.getRange('A2:N' + last_row)
  const data = range.getValues()

  const mergedRanges = range.getMergedRanges()

  return { sheet, class_names, data, mergedRanges }
}

function createNOTClassEventsFromSpreadsheet() {
  const { class_names, data, mergedRanges } = useVars()

  for (let row of data) {
    const date = row[1].getFullYear() + '/' + (row[1].getMonth() + 1) + '/' + row[1].getDate()

    // 新增課程提醒
    for (let i in times) {
      const time = times[i]
      const class_name = class_names[i]
      const event_type = row[5 + i * 2]
      const has_event = ['一般', '網路', '實習'].includes(event_type)

      if (has_event) {
        const event = CalendarApp
          .getDefaultCalendar()
          .createAllDayEvent(class_name, new Date(date + ' ' + time.start), new Date(date + ' ' + time.end))

        event
          .removeAllReminders()
          .addPopupReminder(60 * 7) // 7 hours
      }
    }
  }

  // 新增考試提醒
  for (let mergedRange of mergedRanges) {
    const a1Notation = mergedRange.getA1Notation()
    const a1NotationMatches = a1Notation.match(/^[A-Z]+(\d+):[A-Z]+(\d+)$/)
    const event_name = mergedRange.getDisplayValue()
    const start_time = data[parseInt(a1NotationMatches[1]) - 2][1]
    const end_time = data[parseInt(a1NotationMatches[2]) - 2][1]
    end_time.setDate(end_time.getDate() + 1)

    const event = CalendarApp
      .getDefaultCalendar()
      .createEvent(event_name, new Date(start_time), new Date(end_time))

    event
      .removeAllReminders()
      .addPopupReminder(60 * 4)  // 4 hours
      .addPopupReminder(60 * 24) // 1 day
  }
}

function removeNOTClassEventsFromSpreadsheet() {
  const { class_names, data, mergedRanges } = useVars()

  const events = CalendarApp
    .getDefaultCalendar()
    .getEvents(data[0][1], data[data.length - 1][1])

  const event_names = mergedRanges.map(mergedRange => mergedRange.getDisplayValue())

  // 刪除 課程提醒 和 考試提醒
  events
    .filter(event => [...class_names, ...event_names].includes(event.getTitle()))
    .forEach(event => {
      event.deleteEvent()
    })
}
