import { RpgPlayer, RpgPlayerHooks, Control, Move, RpgClassMap, RpgMap } from '@rpgjs/server'

export const player: RpgPlayerHooks = {
    onConnected(player: RpgPlayer) {
        player.setGraphic('male012')
        player.setHitbox(16, 16)
        player.changeMap('map_1')
    },
    onInput(player: RpgPlayer, { input }) {
        if (input == Control.Back) {
            player.callMainMenu()
        }
    },
    async onJoinMap(player: RpgPlayer) {
        if (player.getVariable('AFTER_INTRO')) {
            return
        }
        await player.showText('Welcome to the U and I. Solve coding challenges with your friends (press SPACE)' )
        player.setVariable('AFTER_INTRO', true)
    }
}