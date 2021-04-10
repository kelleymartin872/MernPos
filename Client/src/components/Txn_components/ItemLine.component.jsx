import React  from 'react';

const ItemLineComponent = (props) => 
{
    let item = props.item;
    const lineStyle={
        cursor: "pointer"
    };
    
    const discLineStyle={
        cursor: "pointer",
        color: "#0c0"
    };
    const rightAlign={
        textAlign: "right"
    };
    
    let render = [];

    render.push ( 
        <div key={item.lineNumber} style={lineStyle} className="row" >
            <div className="col-5"> {item.itemName} </div>
            <div className="col-1" style={rightAlign}> {item.itemQty} </div>
            <div className="col-1"> &times; </div>
            <div className="col-2" style={rightAlign}> {item.itemPrice} </div>
            <div className="col-3" style={rightAlign}> {item.totalPrice.toFixed(2)} </div>
        </div>
    );
    
    if(item.discount && item.discount.discountAmt && item.discount.discountAmt !== 0 )
    {
        render.push ( 
            <div key={item.discount.discountDesc} style={discLineStyle} className="row" >
                <div className="col-8"> {item.discount.discountDesc} </div>
                <div className="col-4" style={rightAlign}> {item.discount.discountAmt.toFixed(2)} </div>
            </div> 
        );
    }

    return render;
}

export default ItemLineComponent;

