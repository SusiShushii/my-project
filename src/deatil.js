import React, { useState, useEffect } from "react";
const  {REACT_APP_API_KEY_GRAPHQL} = process.env;

const MyDetail = () => {
  const [prints, setPrints] = useState([]);
  const sortedPrints = prints.sort((a, b) => b._id - a._id); 
  useEffect(() => {
    fetchPrints();

    const interval = setInterval(fetchPrints, 6000); 

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchPrints = async () => {
    try {
      const response = await fetch(REACT_APP_API_KEY_GRAPHQL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              prints {
                _id
                docNum
                docDate
                docType
                buyerName
                srcName
                srcIp
                pages
                cstatus
              }
            }
          `,
        }),
      });
      const responseData = await response.json();
      const fetchedPrints = responseData.data.prints;
      setPrints(fetchedPrints);
    } catch (error) {
      console.log(error);
    }
  };

/*  const deletePrint = async (docNum) => {
    try {
      const response = await fetch(REACT_APP_API_KEY_GRAPHQL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation {
              deletePrint(docNum: "${docNum}") {
                _id
                docNum
                docDate
                docType
                buyerName
                srcName
                srcIp
                pages
                cstatus
              }
            }
          `,
        }),
      });
      const responseData = await response.json();
      const deletedPrint = responseData.data.deletePrint;
      console.log("Deleted Print:", deletedPrint);

      fetchPrints();
    } catch (error) {
      console.log(error);
    }
  };

  const stopPrint = async (docNum) => {
    try {
      const response = await fetch(REACT_APP_API_KEY_GRAPHQL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation {
              stopPrint(docNum: "${docNum}") {
                _id
                docNum
                docDate
                docType
                buyerName
                srcName
                srcIp
                pages
                cstatus
              }
            }
          `,
        }),
      });
      const responseData = await response.json();
      const deletedPrint = responseData.data.stopPrint;
      console.log("Deleted Print:", deletedPrint);

      fetchPrints();
    } catch (error) {
      console.log(error);
    }
  };
*/
  const print_status_ = (c_status)=>{
    if(c_status==1){
      return "Wait"
    }
    if(c_status==0){
      return "Ready"
    }
  };

  return (
    <React.Fragment>
      <div className="footer">
        <ul className="footer-category">
          <li>Order ID</li>
          <li>Document Number</li>
          <li>Document Date</li>
          <li>Document Type</li>
          <li>Buyer Name</li>
          <li>Source Name</li>
          <li>Source IP</li>
          <li>Total Pages</li>
          <li>Status</li>

        </ul>
        
        {sortedPrints.slice(0, 5).map((print, index) => (
          <ul key={index}>
            <li>{print._id}</li>
            <li>{print.docNum}</li>
            <li>{print.docDate}</li>
            <li>{print.docType}</li>
            <li>{print.buyerName}</li>
            <li>{print.srcName}</li>
            <li>{print.srcIp}</li>
            <li>{print.pages}</li>
            <li>{print_status_(print.cstatus)}</li>
          </ul>
        ))}
      </div>
    </React.Fragment>
  );
};

export default MyDetail;
