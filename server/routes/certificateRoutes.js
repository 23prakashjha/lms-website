import express from 'express'
import { getAllCertificates, getMyCertificates, getCertificateById, createCertificate, deleteCertificate } from '../controllers/certificateController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, adminOnly, getAllCertificates)
router.get('/my', protect, getMyCertificates)
router.post('/', protect, adminOnly, createCertificate)
router.get('/:id', protect, getCertificateById)
router.delete('/:id', protect, adminOnly, deleteCertificate)

export default router
