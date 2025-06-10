import { images } from './images';

interface Coins {
	name: string;
	symbol: string;
	icon: string;
	price: number;
	percentChange: number;
}

export const coins: Coins[] = [
	{
		name: 'Bitcoin',
		symbol: 'BTC',
		icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1024px-Bitcoin.svg.png',
		price: 68.738,
		percentChange: 1.45,
	},
	{
		name: 'Ethereum',
		symbol: 'ETH',
		icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1024px-Bitcoin.svg.png',
		price: 3.268,
		percentChange: 6.09,
	},
	{
		name: 'Litecoin',
		symbol: 'LTC',
		icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1024px-Bitcoin.svg.png',
		price: 8.23,
		percentChange: 1.25,
	},
	{
		name: 'Dogecoin',
		symbol: 'DOGE',
		icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1024px-Bitcoin.svg.png',
		price: 0.084738,
		percentChange: 6.81,
	},
];

export const dt = [
	'AirGap Wallet',
	'Atomic',
	'Bisq',
	'Bitcoin Core',
	'Bither',
	'Bitpay Wallet',
	'BlueWallet',
	'Blockstream Green',
	'Bread',
	'Cobo Wallet',
	'Coinomi',
	'Eidoo',
	'Electrum',
	'Enjin Wallet',
	'Exodus',
	'Jaxx',
	'Mycelium',
	'MyCryptoWallet',
	'MyEtherWallet',
	'Ownbit',
	'Phoenix',
	'Samourai',
	'Trust Wallet',
	'Unstoppable',
	'Wasabi',
];
export const differentWallets = [
	{
		name: 'AirGap_Wallet',
		icon: images.airgap,
	},
	{
		name: 'Atomic_Wallet',
		icon: images.atomic,
	},
	{
		name: 'Bisq',
		icon: images.bisq,
	},
	{
		name: 'Binance',
		icon: images.binance,
	},
	{
		name: 'Bitcoin_Core',
		icon: images.bitcoinCore,
	},
	{
		name: 'Bither',
		icon: images.bither,
	},
	{
		name: 'BlueWallet',
		icon: images.blueWallet,
	},
	{
		name: 'Blockstream_Green',
		icon: images.blockstreamGreen,
	},
	{
		name: 'Bread',
		icon: images.bread,
	},
	{
		name: 'Cex',
		icon: images.cex,
	},
	{
		name: 'Cobo_Wallet',
		icon: images.cobo,
	},
	{
		name: 'Coinbase',
		icon: images.coinbase,
	},
	{
		name: 'Coinomi',
		icon: images.coinomi,
	},
	{
		name: 'Eidoo',
		icon: images.eidoo,
	},
	{
		name: 'Electrum',
		icon: images.electrum,
	},
	{
		name: 'Enjin_Wallet',
		icon: images.enjin,
	},
	{
		name: 'Exodus',
		icon: images.exodus,
	},
	{
		name: 'Jaxx',
		icon: images.jaxx,
	},
	{
		name: 'Ledger',
		icon: images.ledger,
	},
	{
		name: 'Metamask',
		icon: images.metamask,
	},
	{
		name: 'Mycelium',
		icon: images.myCelium,
	},
	{
		name: 'MyCryptoWallet',
		icon: images.myCryptoWallet,
	},
	{
		name: 'MyEtherWallet',
		icon: images.myEtherWallet,
	},
	{
		name: 'Ownbit',
		icon: images.ownbit,
	},
	{
		name: 'Phantom',
		icon: images.phanthom,
	},
	{
		name: 'Phoenix',
		icon: images.phoenix,
	},
	{
		name: 'Samourai',
		icon: images.samourai,
	},
	{
		name: 'Solflare',
		icon: images.solflare,
	},
	{
		name: 'Trezor',
		icon: images.trezor,
	},
	{
		name: 'Trust_Wallet',
		icon: images.trustWallet,
	},
	{
		name: 'Unstoppable',
		icon: images.unstoppable,
	},
	{
		name: 'Wasabi',
		icon: images.wasabi,
	},
];

export const walletOptions = differentWallets.map((wallet) => ({
	value: wallet.name,
	label: wallet.name,
	icon: wallet.icon,
}));
