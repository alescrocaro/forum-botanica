import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToken } from '../../Context/AuthContext';

import Container from '../../components/Container';
import Layout from '../../components/Layout';
import StyledButton from '../../components/Button';
import StyledCard from '../../components/Card';
import HeaderPage from '../../components/HeaderPage';

import Map from './components/Map';

export default function ListPosts() {
  const { user } = useToken();
  //map filter constrols
  const [mapCenter, setMapCenter] = useState([-15, -48]); //tem que ficar onde esta o mapa e o headerpage
  const [mapSearchRadius, setMapSearchRadius] = useState(12);
  const [mapShowRadius, setMapShowRadius] = useState(false);
  
  const mapControls = new Object();
  mapControls.setMapCenter = (c) => {setMapCenter(c)};
  mapControls.getMapCenter = () => {return mapCenter};
  mapControls.setSearchRadius = (r) => {setMapSearchRadius(r)}; 
  mapControls.getSearchRadius = () => {return mapSearchRadius};
  mapControls.setShowRadius = (r) => {setMapShowRadius(r)}; 
  mapControls.getShowRadius = () => {return mapShowRadius};

  //filter controls
  const applyFilters = async filters => {
    try {
      const { data } = await api.get('/posts', { params: filters });
      setPosts(data);
    } catch (error) {
      console.log('error getting posts', error);
    }
  };

  // //funcao para setar o mapcenter (latlng)
  // const handleMapCenter = (c) => {setMapCenter(c)}; //tem que ser enviado pro mapa, e recebido aqui por meio de props

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/posts');
        setPosts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  return (
    <Layout>
      <Container
        container
        sx={{
          minHeight: '0 !important'
        }}
      >
        {user && (
          <StyledButton
            title={'ADICIONAR NOVA OBSERVAÇÃO'}
            icon={'add'}
            isLinkActive
          />
        )}
        
        <Map posts={posts} mapControls={mapControls} />

        <HeaderPage
          title="Mostrando observações recentes:"
          filter
          mapControls={mapControls}
          applyFilters={applyFilters}
        />
        {posts.map(post => (
          <StyledCard key={post.id} post={post} />
        ))}
      </Container>
    </Layout>
  );
}
