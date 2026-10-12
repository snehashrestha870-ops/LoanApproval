const db = require('../../constant/db')
const slug = require("slug");
const validateBank = require('../../validation/bank/bankValidation');
const { format } = require('date-fns');

const fs = require('fs');
const path = require('path');

const IMAGE_BASE_URL = 'http://localhost:8080';
const DEFAULT_IMAGE_NAME = 'default-blog.jpg';

function resolveBlogImage(imageName) {
  if (!imageName) {
    return `${IMAGE_BASE_URL}/${DEFAULT_IMAGE_NAME}`;
  }

  const safeImageName = String(imageName).replace(/^\/+/, '');
  const filePath = path.resolve(__dirname, '../../public/images', safeImageName);

  if (fs.existsSync(filePath)) {
    return `${IMAGE_BASE_URL}/${safeImageName}`;
  }

  return `${IMAGE_BASE_URL}/${DEFAULT_IMAGE_NAME}`;
}

function imageDelete(id, connection) {
  const sqlGet = `SELECT image FROM blogs WHERE blog_id=${id}`;
  connection.query(sqlGet, (err, result) => {
    if (err || !result || result.length === 0) {
      return;
    }

    const image = result[0]?.image;
    if (!image) {
      return;
    }

    const safeImageName = String(image).replace(/^\/+/, '');
    const imagePath = path.resolve(__dirname, '../../public/images', safeImageName);

    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr && unlinkErr.code !== 'ENOENT') {
        console.error('Failed to delete blog image:', unlinkErr.message);
      }
    });
  });
}

module.exports.addBlog = async (request, response) => {
  const connection = await db.conn();
  const validateBlog = await validateBank.addBlog(request)
  validateBlog.check().then((matched) => {
    if (!matched) {
      return response.status(400).
        json({ errors: validateBlog.errors })
    }
    const data =
    {
      blog_name: request.body.blog_name,
      description: request.body.description,
      slug: slug(request.body.blog_name),
      image: request.file.filename,
      date: format(new Date(), 'yyyy-MM-dd')
    }

    const query = 'insert into blogs SET ?';
    connection.query(query, data, (error, results) => {
      connection.release();

      if (error) {
        return response.status(400).json({
          message: "Some problem occured" + error,
          success: false,
        })
      }
      else {
        return response.status(200).json({
          message: "success",
          success: true,
        })
      }
    });
  });
}

module.exports.getBlog = async (request, response) => {
  const connection = await db.conn();

  const getquery = `select * from blogs `
  // ORDER BY category_order ASC
  connection.query(getquery, (err, result) => {
    connection.release();

    if (err) {
      return response.status(400).json({
        message: "Some problem occured",
        sucess: false,
      })

    }
    else {
      const data = (result || []).map((post) => ({
        ...post,
        blog_image: resolveBlogImage(post.image),
      }));

      return response.status(200).json({
        message: "Sucess",
        sucess: true,
        data,
      })
    }
  })

};

module.exports.getByIdBlog = async (request, response) => {
  const connection = await db.conn();
  const blogid = request.params.blog_id;
  const getquery = `select * from blogs where blog_id=${blogid}`
  // ORDER BY category_order ASC
  connection.query(getquery, (err, result) => {
    connection.release();

    if (err) {
      return response.status(400).json({
        message: "Some problem occured",
        sucess: false,
      })

    }
    else {
      const data = result[0] ? { ...result[0], blog_image: resolveBlogImage(result[0].image) } : null;
      return response.status(200).json({
        message: "Sucess",
        sucess: true,
        data,
      })
    }
  })

};

module.exports.getBySlugBlog = async (request, response) => {
  const connection = await db.conn();
  const blog_slug = request.params.slug;
  const getquery = `select * from blogs where slug='${blog_slug}'`
  // ORDER BY category_order ASC
  connection.query(getquery, (err, result) => {
    connection.release();

    if (err) {
      return response.status(400).json({
        message: "Some problem occured",
        sucess: false,
      })

    }
    else {
      const data = result[0] ? { ...result[0], blog_image: resolveBlogImage(result[0].image) } : null;
      return response.status(200).json({
        message: "Sucess",
        sucess: true,
        data,
      })
    }
  })

};

module.exports.updateBlog = async (request, response) => {
  const connection = await db.conn();
  const blogid = request.params.blog_id;

  const data = {
    blog_name: request.body.blog_name,
    description: request.body.description,
    slug: slug(request.body.blog_name),

  }
  if (request.file) {
    imageDelete(blogid, connection)
    data['image'] = request.file.filename
  }
  // console.log(data)
  connection.query(`update blogs SET ? where blog_id=${blogid}`, data, (error, result) => {
    connection.release();

    if (error) {
      return response.status(400).json({
        message: "Some problem occured" + error,
        sucess: false,
      })
    }
    else {
      return response.status(200).json({
        message: "Sucess",
        sucess: true,
        data: result
      })
    }
  })

};

// delete api 
module.exports.deleteBlog = async (request, response) => {
  const connection = await db.conn();

  const { blog_id } = request.params
  imageDelete(blog_id, connection)
  const deletequery = `DELETE FROM blogs WHERE blog_id= ${blog_id}`
  connection.query(deletequery, (error, result) => {
    connection.release();

    if (error) {
      response.status(400).json({
        message: "Data not deleted" + err,
        success: false
      })
    }
    else {

      response.status(200).json({
        message: "Data deleted",
        success: true
      })
    }
  });


}