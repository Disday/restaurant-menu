import { PrismaClient as Prisma } from '@prisma/client'
import express from 'express';
import { body, validationResult } from 'express-validator';
import cors from 'cors';
import path from 'path';

const multer = require('multer')
const prisma = new Prisma();
const app = express();
const upload = multer({ dest: 'images/' })

app.use(express.json())
app.use('/images', express.static('./images'));
app.use(express.static('./vue-project/dist'));
app.use(cors(
  // { origin: process.env.API_URL }
));


app
  .get('/', async (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'vue-project/dist/index.html'));
  })
  .get('/items', async (req, res) => {
    console.log('');
    const items = await prisma.item.findMany({
      include: {
        categories: true,
        image: true
      }
    });
    res.json(items);
  })
  .get('/categories', async (req, res) => {
    const categories = await prisma.category.findMany();
    res.json(categories);
  })

  .post('/item/image', upload.single('file'), async (req, res) => {
    const filename = req?.file?.filename ?? '';
    const itemId: number = Number(req.body.itemId);
    const image = await prisma.image.findUnique({
      where: {
        itemId
      }
    });
    if (image) {
      await prisma.image.delete({ where: { id: image.id } });
    }

    await prisma.image.create({
      data: {
        filename,
        item: {
          connect: { id: Number(itemId) }
        }
      }
    })
    return res.status(201).json({ filename })

  })
  .post('/item',
    body('name').isLength({ min: 1 }),
    body('description').isLength({ min: 1 }),
    async (req, res) => {
      console.log('post', req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(200).json({ errors: errors.array() });
      }

      const { name, description, categoryIds = '' } = req.body;
      const item = await prisma.item.findUnique({ where: { name } });

      if (item) {
        return res.status(200).json({ errors: [{ param: 'name', msg: 'not uniq name' }] });
      }

      const categories = categoryIds
        .map((id: string) => ({ id: Number(id) }));

      const newItem = await prisma.item.create({
        data: {
          name,
          description,
          categories: {
            connect: categories
          },
        },
      })

      res.json({ id: newItem.id });
    })
  .patch('/item/:id',
    body('name').isLength({ min: 1 }),
    body('description').isLength({ min: 1 }),
    async (req, res) => {
      console.log('patch', req.body);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(200).json({ errors: errors.array() });
      }
      const id: number = Number(req?.params?.id)
      const { name, description, categoryIds = '' } = req.body;

      const categories = categoryIds
        .map((id: string) => ({ id: Number(id) }));
      const item = await prisma.item.update({
        where: { id },
        data: {
          name,
          description,
          categories: {
            set: [],
            connect: categories
          },
        },
      })

      res.status(200).json({ id });
    })

const port = 9000;
app.listen(port, () =>
  console.log(`server started at port ${port}`),
);

