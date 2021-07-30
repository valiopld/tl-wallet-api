class ChannelSwap {
    constructor(client, dealer, trade) {
        this.client = client;
        this.dealer = dealer
        this.trade = trade;
        this.openChannel();
    }

    openChannel() {
        this.handleEvents();
        const buyerId = this.trade.buyerSocketId;
        this.client.emit('new-channel', { ...this.trade, buyer: this.client.id === buyerId });
        this.dealer.emit('new-channel', { ...this.trade, buyer: this.dealer.id === buyerId });
    }

    handleEvents() {
        const eventsArray = [
            'TERMINATE_TRADE',
            'SELLER:MS_DATA',
            'SELLER:COMMIT_UTXO' ,
            'SELLER:SIGNED_RAWTX',
            'BUYER:COMMIT',
            'BUYER:RAWTX',
            'BUYER:FINALTX',
        ];
        eventsArray.forEach(e => this.removePreviuesEventListeners(e));
        eventsArray.forEach(e => this.handleEventsAndPassToCP(e));

    }

    removePreviuesEventListeners(event) {
        this.client.removeAllListeners(`${this.client.id}::${event}`);
        this.dealer.removeAllListeners(`${this.dealer.id}::${event}`);
    }

    handleEventsAndPassToCP(event) {
        const dealerEvent = `${this.dealer.id}::${event}`;
        const clientEvent = `${this.client.id}::${event}`;
        this.dealer.on(dealerEvent, (data) => this.client.emit(dealerEvent, this.dealer.id, data));
        this.client.on(clientEvent, (data) => this.dealer.emit(clientEvent, this.client.id, data));
    }
}

module.exports = {
    ChannelSwap,
}