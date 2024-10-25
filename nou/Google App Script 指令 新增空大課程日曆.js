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

  const lastRow = sheet.getLastRow()

  const classNamesData = sheet.getRange('A1:N1').getValues()
  const classNames = times.map((_, i) => classNamesData[0][4 + i * 2])

  const range = sheet.getRange('A2:N' + lastRow)
  const data = range.getValues()

  const mergedRanges = range.getMergedRanges()

  return { sheet, classNames, data, mergedRanges }
}

function createNOTClassEventsFromSpreadsheet() {
  const { classNames, data, mergedRanges } = useVars()

  for (let row of data) {
    const date = row[1].getFullYear() + '/' + (row[1].getMonth() + 1) + '/' + row[1].getDate()

    // 新增課程提醒
    for (let i in times) {
      const time = times[i]
      const className = classNames[i]
      const eventType = row[5 + i * 2]
      const hasEvent = ['一般', '網路', '實習'].includes(eventType)

      if (hasEvent) {
        const event = CalendarApp
          .getDefaultCalendar()
          .createAllDayEvent(className, new Date(date + ' ' + time.start), new Date(date + ' ' + time.end))

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
    const eventName = mergedRange.getDisplayValue()
    const startTime = data[parseInt(a1NotationMatches[1]) - 2][1]
    const endTime = data[parseInt(a1NotationMatches[2]) - 2][1]
    endTime.setDate(endTime.getDate() + 1)

    const event = CalendarApp
      .getDefaultCalendar()
      .createEvent(eventName, new Date(startTime), new Date(endTime))

    event
      .removeAllReminders()
      .addPopupReminder(60 * 4)  // 4 hours
      .addPopupReminder(60 * 24) // 1 day
  }
}

function removeNOTClassEventsFromSpreadsheet() {
  const { classNames, data, mergedRanges } = useVars()

  const events = CalendarApp
    .getDefaultCalendar()
    .getEvents(data[0][1], data[data.length - 1][1])

  const eventNames = mergedRanges.map(mergedRange => mergedRange.getDisplayValue())

  // 刪除 課程提醒 和 考試提醒
  events
    .filter(event => [...classNames, ...eventNames].includes(event.getTitle()))
    .forEach(event => {
      event.deleteEvent()
    })
}
