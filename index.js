const fs = require( 'fs' )
const path = require( 'path' )
const { Client, Intents, Collection } = require( 'discord.js' )

const dateTime = require( './functions/date-time' )

const botconfig = require( './botconfig.json' )

const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
]})



// Log when the bot comes online
client.on( 'ready', () => {
    console.log( `[${dateTime.formattedDate()}] ${client.user.username} is online` )
})



// Register commands
client.commands = new Collection()

const modules = [ 'moderation' ]

modules.forEach( module => {
    fs.readdir( path.join( __dirname, 'commands', module ), ( err, files ) => {
        
        if ( err ) console.log( err )

        let jsfile = files.filter( f => f.split( '.' ).pop() == 'js' )
        if ( jsfile.length == 0 ) {
            return console.log( `[${dateTime.formattedDate()}] Couldn't find commands!` )
        }

        jsfile.forEach( ( f ) => {
            const command = require( path.join( __dirname, 'commands', module, f ) )
            client.commands.set( command.data.name, command )
        })
    })
})



// Listen to commands
client.on( 'interactionCreate', async interaction => {
    if (! interaction.isCommand() ) return

    const command = client.commands.get( interaction.commandName )

    if (! command ) return

    try {
        await command.execute( client, interaction )
    } catch( error ) {
        console.log( `[${dateTime.formattedDate()}] ${error}` )
        await interaction.reply( { content: 'There was an error while executing this command!', ephemeral: true } )
    }
})



// Start the bot
client.login( botconfig.token )