
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
            used: 2
        }
        return CouponStatus;
    }
}

module.exports.Constants = Constants;