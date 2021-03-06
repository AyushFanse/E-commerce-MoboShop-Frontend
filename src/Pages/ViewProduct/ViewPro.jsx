import { Grid, Box, Button, CardActions } from '@mui/material';
import { SaveProduct, DeleteSavedProduct, TabTitle } from '../../Components/Common/CommonFun';
import React, { useEffect, useState, useRef } from 'react';
import { useHistory, useParams } from "react-router-dom";
import Navbar from '../../Components/Navbar/Navbar';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import './viewPro.css';

const ViewPro = ({ DataBase }) => {


    const [saved, setSaved] = useState([]);
    const [product, setProduct] = useState([]);
    const [changed, setChange] = useState('');
    const history = useHistory();
    const { productId } = useParams();
    const FatchRef = useRef();
    const localToken = localStorage.getItem('token');
    const decodedToken = jwt.decode(localToken);
    const formatter = new Intl.NumberFormat("en-US",
        {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
        });
    TabTitle(`MOBO SHOP | Product`)



    useEffect(() => {
        FatchRef.current();
    }, [changed])

    const Fatch = async () => {
        let response = await axios.get(`${DataBase}/product/getproduct/${productId}`,
            {
                headers: { token: localToken }
            })
        setProduct(response.data);

        if (decodedToken) {
            let responseUsers = await axios.get(`${DataBase}/users/getuser/${decodedToken.user._id}`,
                {
                    headers: { token: localToken }
                })
            setSaved(responseUsers.data.savedProduct);
        }
        setChange('');
    }

    FatchRef.current = Fatch;
 
    const Save = ((P, U, L) => {

        if (decodedToken === null) {
            history.push('/login');
        } else {
            if (decodedToken.exp * 1000 <= Date.now()) {
                localStorage.removeItem('token');
                alert("Session Timeout Please Login Again...");
                history.push('/login');
            } else {
                SaveProduct(P, U, L)
            }
        }
    })

    const Unsave = ((P, U, L) => {

        if (decodedToken === null) {
            history.push('/login');
        } else {
            if (decodedToken.exp * 1000 <= Date.now()) {
                localStorage.removeItem('token');
                alert("Session Timeout Please Login Again...");
                history.push('/login');
            } else {
                DeleteSavedProduct(P, U, L)
            }
        }
    })

    return (
        <>
            <Navbar page={'Product'} />
            <Grid className='viewProductBody'>
                <Box className="displayItoms">
                    <div className="col-md-6 d-flex justify-content-center">
                        <a className="imgBack d-flex justify-content-center" href={product.file}>
                            <img className="p-3 Image" src={product.file} alt="" />
                        </a>
                    </div>
                    <div className="col-md-5" id="Details">
                        <div className="p-1 fontSize1 fontstyle">{product.productName}</div>
                        <p className="p-1"><span id="price"><b>Price:</b><span id="priceVal fontstyle"> {formatter.format(product.price)}.00</span></span></p>
                        <p className="row p-1" id="rom">
                            <span className="col-md-4 d-flex justify-content-start fontstyle processor" >RAM: {product.ram}</span>
                            <span className="col-md-8 d-flex justify-content-start fontstyle processor" >ROM: {product.rom}</span>
                        </p>
                        <p className="p-1 fontstyle processor" >Processor: {product.processor}</p>
                        <p className="p-1 fontstyle processor" >Battry: {product.battery} mAh</p>
                        <Box className="d-grid gap-2 d-md-block">
                            <CardActions sx={{ disply: 'flax', justifyContent: 'center', mt: '2rem' }}>
                                {
                                    saved.includes(product._id)
                                        ?
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            style={{ border: '1px solid #fff', borderBottom: '1px solid  var(--cl)', borderRadius: '10px' }}
                                            onClick={() => { Unsave(product._id, decodedToken.user._id, DataBase) }}
                                        >
                                            REMOVE
                                        </Button>
                                        :
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{ border: '1px solid #fff', borderBottom: '1px solid var(--theam)', borderRadius: '10px' }}
                                            onClick={() => { decodedToken ? Save(product._id, decodedToken.user._id, DataBase) : history.push('/login') }}
                                        >
                                            ADD TO CART
                                        </Button>
                                }
                            </CardActions>
                        </Box>
                    </div>
                </Box>
            </Grid>
        </>
    );
}

export default ViewPro;