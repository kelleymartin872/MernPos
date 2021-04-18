

export default class Constants
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

    static get APIUrl()
    {
        const APIUrl = {
            base: "http://localhost:4000/api/",
            userService: "userService/",
            transactionService: "transactionService/",
            itemService: "itemService/",
            customerService: "customerService/",
            couponService: "couponService/",
            paymentService: "paymentService/"
        }
        return APIUrl;
    }

    static get MenuButtonID()
    {
        const MenuButtonID = {
            AddItem : 1,
            ReturnItem : 2,
            ChangeQty : 3,
            LineDisc : 4,
            TotalDisc : 5,
            AddCustomer : 6,
            RemoveLine : 7,
            ReturnReceipt : 8,
            AbortTxn : 9
        }
        return MenuButtonID;
    }
    
}
