export class siteConfigReqModel{
    siteName : string;
    clientUrl : string;
    logo : string;
    whiteLogo : string;
    icon : string;
    mobile : string;
    email : string;
    currency : string = '£';
    deliveryCharge : number = 20;
    primaryColor : string = '#7b10b9';
    marqueeItems : { emoji: string; text: string }[] = [
        { emoji: '🎁', text: 'Free shipping on every order' },
        { emoji: '⚡', text: 'Get up to 20% OFF on all Prepaid Orders!' },
        { emoji: '🛒', text: 'Buy 3 Products for Just ₹699!' },
        { emoji: '✨', text: 'Free Kojic Acid Soap on purchase of Exfoliating Gel Pack of 3' }
    ];
    metaPixelId   : string = '';
    metaAccessToken : string = '';
    buyNowText    : string = 'BUY NOW';
    buyNowSubtext : string = '';

    instagramURL : string;
    facebookURL : string;
    twitterURL : string;
    linkedInURL : string;
    youtubeURL : string;

    enablePlayerLogin : boolean;
}