const tg = window.Telegram.WebApp;

export function useTelegram() {

    // const onClose = () => {
    //     tg.close()
    // }
    //
    // const onToggleButton = () => {
    //     if(tg.MainButton.isVisible) {
    //         tg.MainButton.hide();
    //     } else {
    //         tg.MainButton.show();
    //     }
    // }

    return {
        // onClose,
        // onToggleButton,
        tg,
        first_nameTg: tg.initDataUnsafe?.user?.first_name,
        last_nameTg: tg.initDataUnsafe?.user?.last_name,
        queryId: tg.initDataUnsafe?.query_id,
        userId: tg.initDataUnsafe?.user?.id
    }
}
