import React, { useState, useEffect } from "react";

import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as List } from "../../assets/list.svg";
import { ReactComponent as Search } from "../../assets/search.svg";
import { getMyProfile, searchProducts } from "../../api";

import './index.scss';

const Header = ({ showSideBar, setShowSideBar }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [foto, setFoto] = useState();
  const [search, setSearch] = useState('');
  const [result, setResult] = useState([]);

  const getProfile = async () => {
    const { nombre, apellido, foto_perfil } = await getMyProfile()
    setUsername(`${nombre} ${apellido}`)
    setFoto(foto_perfil)
  }

  useEffect(() => {
    if (search) {
      searchProducts({ search }).then((response) => {
        setResult(response.products)
      })
    } else {
      setResult([])
    }
  }, [search])

  const logout = () => {
    localStorage.clear()
    navigate("/login", { replace: false })
  }

  useEffect(() => {
    getProfile()
  }, [])

  return (
    <>
      {showSideBar && (
        <div className="side-bar-container">
          <div className="side-bar">
            <div>
              <div className="side-bar__top">
                <img
                  src={foto}
                  alt="profile"
                  className="side-bar__top-image"
                />
                <span className="side-bar__top-text">{username}</span>
              </div>
              <div className="side-bar__options">
                <div className="options" onClick={() => { navigate(`/myprofile`) }}>
                  <Icon icon="ant-design:user-outlined" height="15" />
                  <span classname="options-text"> Perfil </span>
                </div>
                <div className="options" onClick={() => { navigate('/inventory') }}>
                  <Icon icon="ic:outline-inventory-2" height="15" />
                  <span classname="options-text" > Mi inventario </span>
                </div>
                <div className="options" onClick={() => { navigate('/exchanges') }}>
                  <Icon icon="ic:outline-inventory-2" height="15" />
                  <span classname="options-text" > Mis intercambios </span>
                </div>
              </div>
            </div>
            <div className="side-bar-space">
              <div className="side-bar-logout" onClick={logout}>
                <span
                  className="side-bar-logout-text"
                >
                  Cerrar sesion
                </span>
                <Icon
                  icon="bx:log-out"
                  className="side-bar-logout-icon"
                  height="24"
                />
              </div>
            </div>
          </div>
          <div
            className="side-bar-outside"
            onClick={() => {
              setShowSideBar(false);
            }}
          ></div>
        </div>
      )}
      <div className="header">
        <span
          className="header-list"
          onClick={() => {
            setShowSideBar(true);
          }}
        >
          <List />
        </span>
        <div className="header-search">
          <div className="header-search-bar">
            <Search className="search-icon" />
            <input className="search-bar-input" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Buscar un producto"></input>
          </div>
          <div className="header-search__products">
            {
              result &&
              result.map((data) => (
                <div onClick={() => navigate(`product/${data.id}`)} key={data.id} className="header-search__products-list"><img src={data.foto} alt="" />{data.titulo}</div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
