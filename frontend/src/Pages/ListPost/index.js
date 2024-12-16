import React, { useEffect, useState } from "react";
import { useToken } from "../../Context/AuthContext";
import StyledButton from "../../components/Button";
import StyledCard from "../../components/Card";
import Container from "../../components/Container";
import HeaderPage from "../../components/HeaderPage";
import Layout from "../../components/Layout";
import { api } from "../../services/api";
import Map from "./components/Map";

export default function ListPosts() {
  const { user } = useToken();
  //map filter controls
  const [mapCenter, setMapCenter] = useState([-15, -48]); //tem que ficar onde esta o mapa e o headerpage
  const [mapSearchRadius, setMapSearchRadius] = useState(12);
  const [mapShowRadius, setMapShowRadius] = useState(false);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});

  const mapControls = {
    getMapCenter: () => {
      return mapCenter;
    },
    setMapCenter: (c) => {
      setMapCenter(c);
    },
    getSearchRadius: () => {
      return mapSearchRadius;
    },
    setSearchRadius: (r) => {
      setMapSearchRadius(r);
    },
    getShowRadius: () => {
      return mapShowRadius;
    },
    setShowRadius: (r) => {
      setMapShowRadius(r);
    },
  };

  const getPosts = async (filters) => {
    api.get("/posts", { params: filters })
      .then(({ data }) => {
        setPosts(data.data);
        setPagination(data.pagination);
      })
      .catch((error) => {
        console.error("Erro ao obter posts:", error);
        setPosts([]);
  });
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Layout>
      <Container
        container
        sx={{
          minHeight: "0 !important",
        }}
      >
        {user && (
          <StyledButton
            title={"ADICIONAR NOVA OBSERVAÇÃO"}
            icon={"add"}
            isLinkActive
          />
        )}

        <Map posts={posts} mapControls={mapControls} />

        <HeaderPage
          title="Mostrando observações recentes:"
          filter
          mapControls={mapControls}
          applyFilters={getPosts}
        />
        {Array.isArray(posts) && posts.length ? (
          posts.map((post) => <StyledCard key={post.id} post={post} />)
        ) : (
          <span>nenhuma observação encontrada</span>
        )}

        {/* <div>
          <p>Página {pagination.page} de {pagination.totalPages}</p>
          <p>Total de {pagination.totalElements} posts</p>
        </div> */}
      </Container>
    </Layout>
  );
}
