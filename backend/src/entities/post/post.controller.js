const { Post, Image, User } = require("../../models");
const { v4: uuid } = require("uuid");
const sequelize = require("sequelize");
const { post_errors } = require("../../errors/200-post");
const fs = require("fs");

module.exports = {
  async index(req, res) {
    try {
      //se tiver filtros
      if (Object.keys(req.query)?.length) {
        const distanceAttr = sequelize.fn(
          "ST_DistanceSphere",
          sequelize.literal(`latlng`),
          sequelize.literal(
            `ST_MakePoint(${req.query.mapCenter[1]}, ${req.query.mapCenter[0]})`
          )
        );

        const posts = await Post.findAll({
          include: [
            { model: Image },
            {
              model: User,
              attributes: ["name", "email", "id"],
            },
          ],
          where: {
            $and: sequelize.where(distanceAttr, {
              [sequelize.Op.lte]: req.query.mapSearchRadius * 1000,
            }),
          },
          order: [["updatedAt", "DESC"]],
        });

        console.log("posts com filtro ->", posts);
        return res.json(posts);
      } else {
        const posts = await Post.findAll({
          include: [
            { model: Image },
            {
              model: User,
              attributes: ["name", "email", "id"],
            },
          ],
          order: [["updatedAt", "DESC"]],
        });

        console.log("posts sem filtro", posts);
        return res.json(posts);
      }
    } catch (error) {
      console.log("error getting posts", error);
      res.status(500).send();
    }
  },

  async get(req, res) {
    try {
      const post = await Post.findOne({
        where: { id: req.params.id },
        include: [
          { model: Image },
          { model: User, attributes: ["name", "email", "id"] },
        ],
      });

      return res.json(post);
    } catch (error) {
      console.log("error getting post", error);
      res.status(500).send();
    }
  },

  async create(req, res) {
    try {
      let {
        title,
        biome,
        userName,
        specie,
        genus,
        family,
        order,
        className,
        phylum,
        kingdom,
        country,
        city,
        weather,
        dateFound,
        description,
        latlng,
        tags,
        userId,
      } = req.body;
      biome = biome.toLowerCase();
      specie = specie.toLowerCase();
      genus = genus.toLowerCase();
      family = family.toLowerCase();
      order = order.toLowerCase();
      className = className.toLowerCase();
      phylum = phylum.toLowerCase();
      kingdom = kingdom.toLowerCase();

      const post = await Post.create({
        id: uuid(),
        title,
        biome,
        userName,
        specie,
        genus,
        family,
        order,
        className,
        phylum,
        kingdom,
        country,
        city,
        weather,
        dateFound,
        description,
        tags,
        latlng: { type: "Point", coordinates: [latlng.lng, latlng.lat] }, //geojson format [lng, lat]
        userId,
      });
      return res.json(post.dataValues.id);
    } catch (error) {
      console.log("Error creating post", error);
      res.status(500).send();
    }
  },

  async update(req, res) {
    const { id } = req.params;

    const post = await Post.findOne({
      where: {
        id,
      },
    });

    if (post.userId !== req.user_id) {
      return res.sendStatus(401);
    }

    if (!post) {
      return res.status(404).json({ code: 200, message: post_errors["200"] });
    }

    const updatedPost = await post.update(req.body).catch((error) => {
      console.log("error updating post: ", error);
      res.status(500).json(error);
    });

    return res.status(200).json({ UpdatePost: updatedPost.dataValues });
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      // const user_id = req.headers.authorization;
      /*
      if(post.user_id !== user_id){
        return response.status(401).json({ error: 'Unauthorized user.'}); 
        // 401 - nao autorizado
      }
  
      */
      await Post.destroy({
        where: {
          id: id,
        },
      });

      return res.status(204).send(); // 204 - res sucesso sem conteudo
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  },

  async addPostImage(req, res) {
    const { id } = req.params;

    const post = await Post.findOne({
      where: {
        id,
      },
    }).catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });

    if (!post) {
      return res.status(404).json({ code: 200, message: post_errors["200"] });
    }
    if (req.files == null) {
      return res.status(400).json({ code: 201, message: post_errors["201"] });
    }

    for (element in req.files) {
      await Image.create({
        id: uuid(),
        url: req.files[element].filename,
        postId: id,
      }).catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
    }

    return res.status(204).send();
  },

  // testar já implementando a funcionalidade no frontend...
  async deletePostImage(req, res) {
    const { id } = req.params;

    const image = await Image.findOne({
      where: {
        id,
      },
    }).catch((error) => {
      console.log(error);
      return res.status(500).json(error);
    });

    if (!image) {
      return res.status(404).json({ code: 203, message: post_errors["203"] });
    }

    const postImages = await Image.findAll({
      where: {
        postId: image.postId,
      },
    }).catch((error) => {
      console.log(error);
      return res.status(500).json(error);
    });

    if (postImages.length <= 1) {
      return res.status(400).json({ code: 203, message: post_errors["203"] });
    }

    const imagePath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      "images",
      image.url
    );

    // Deletar o arquivo de imagem
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Falha ao deletar a imagem do sistema de arquivos." });
      }

      Image.destroy({
        where: {
          id,
        },
      }).catch((error) => {
        console.log(error);
        return res.status(500).json(error);
      });

      return res.status(204).send();
    });

    return res.status(204).send();
  },
};
