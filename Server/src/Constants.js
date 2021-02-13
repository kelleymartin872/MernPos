

const TxnLineType = {
    headerLineType:     1,
    CustomerLineType:   2,
    ItemLineType:       3,
    DiscountLineType:   4,
    CommentLineType:    5,
    CouponLineType:     6,
    TotalLineType:      7,
    PaymentLineType:    8,
    FooterLineType:     9
}

class Constants
{
    static get TxnLineType()
    {
        return TxnLineType;
    }
}
module.exports.Constants = Constants;