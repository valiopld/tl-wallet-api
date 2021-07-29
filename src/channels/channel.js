class ChannelSwap {
    constructor(client, dealer, trade) {
        this.client = client;
        this.dealer = dealer;
        this.trade = trade;
        this.openChannel();
    }

    openChannel() {
        const buyerId = this.trade.buyerSocketId;
        this.client.emit('new-channel', { ...this.trade, buyer: this.client.id === buyerId });
        this.dealer.emit('new-channel', { ...this.trade, buyer: this.dealer.id === buyerId });
    }

}

module.exports = {
    ChannelSwap,
}