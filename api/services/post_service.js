const Post = require('../src/models/posts');
const PostMeta = require('../src/models/posts_meta');
const extractFirstImageUrl = require('../utils/extract_image');
const extractIntroParagraph = require('../utils/extract_article_from_meta');

async function getPublishedPosts() {
  const posts = await Post.findAll({
    where: { post_type: 'post', post_status: 'publish' },
    include: [{
      model: PostMeta,
      as: 'PostMetas',
      required: false,
      where: { meta_key: '_elementor_data' }
    }]
  });

  const transformedPosts = await Promise.all(posts.map(post => getPostData(post)));
  return transformedPosts;
}

async function getPostData(post) {
    let image_url = null;
    let delailed_articles = null;

    const elementorData = post.PostMetas.find(meta => meta.meta_key === '_elementor_data')?.meta_value || '[]';
    const parsedData = JSON.parse(elementorData);

    image_url = extractFirstImageUrl(parsedData);
    delailed_articles = extractIntroParagraph(parsedData);

    return {
        ...post.get({ plain: true }),
        image_url,
        delailed_articles
    };
}

async function getPublishedPostById(id) {
    const post = await Post.findOne({
        where: {
            id: id,
            post_type: 'post',
            post_status: 'publish',
        },
        include: [{
            model: PostMeta,
            as: 'PostMetas',
            required: false,
            where: { meta_key: '_elementor_data' }
        }]
    });

    if (!post) {
        throw new Error('Post not found');
    }

    return await getPostData(post);
}

module.exports = { getPublishedPosts, getPublishedPostById };