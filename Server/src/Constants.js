
class Constants
{
    
    static get PosState()
    {
        const PosState = {
            signedOff: 0,
            signedOn: 1,
            itemState: 2,
            payState: 3
        };
        return PosState;
    }

    static get TxnLineType()
    {
        const TxnLineType = {
            TxnLine:        0,
            HeaderLine:     1,
            CustomerLine:   2,
            ItemLine:       3,
            DiscountLine:   4,
            CommentLine:    5,
            CouponLine:     6,
            TotalLine:      7,
            PaymentLine:    8,
            FooterLine:     9
        };
        return TxnLineType;
    }

    static get TxnLineName()
    {
        const TxnLineName = {
            TxnLine:        "TxnLine",
            HeaderLine:     "HeaderlLine",
            CustomerLine:   "CustomerLine",
            ItemLine:       "ItemLine",
            DiscountLine:   "DiscountLine",
            CommentLine:    "CommentLine",
            CouponLine:     "CouponLine",
            TotalLine:      "TotalLine",
            PaymentLine:    "PaymentLine",
            FooterLine:     "FooterLine"
        };
        return TxnLineName;
    }

    static get CouponStatus()
    {
        const CouponStatus = {
            created: 0,
            reserved: 1,
            redeemed: 2
        }
        return CouponStatus;
    }
    

    static get PaymentType()
    {
        const PaymentType = {
            INR: 100,

            USD: 201,
            EUR: 202,

            VISA: 301,
            MasterCard: 302,
            AMEX: 303,

            UPI: 401,
            GPay: 402,
            PayTM: 403,

            Points: 501,
            Voucher: 601
        }
        return PaymentType;
    }
    
    static get ItemType()
    {
        const ItemType = {
            normal: 0,
            customerPoints: 1
        };
        return ItemType;
    }
    
    static get DiscType()
    {
        const DiscType = {
            auto: 0,
            createCoupon: 1,
            redeemCoupon: 2,
            manual: 3
        };
        return DiscType;
    }
}

module.exports.Constants = Constants;