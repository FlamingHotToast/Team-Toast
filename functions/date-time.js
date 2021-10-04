const dateTime = require( 'date-and-time' )

module.exports = {
    formattedDate() {
        const now = dateTime.format( new Date(), 'YYYY/MM/DD HH:mm:ss')

        return now
    }
}