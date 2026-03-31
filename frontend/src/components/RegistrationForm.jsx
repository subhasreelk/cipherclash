import { useState } from 'react'
import axios from 'axios'
import MemberFields from './MemberFields'
import styles from './RegistrationForm.module.css'

const EMAIL_REGEX = /^[0-9]{2}[a-zA-Z]{1,2}[0-9]{2,3}@psgtech\.ac\.in$/
const PHONE_REGEX = /^[6-9]\d{9}$/
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const DEPARTMENTS = [
  'Automobile Engineering',
  'Biomedical Engineering',
  'Civil Engineering',
  'Computer Science and Engineering',
  'Computer Science and Engineering (AI and ML)',
  'Electrical and Electronics Engineering',
  'Electronics and Communication Engineering',
  'Instrumentation and Control Engineering',
  'Mechanical Engineering',
  'Metallurgical Engineering',
  'Production Engineering',
  'Robotics and Automation',
  'Bio Technology',
  'Fashion Technology',
  'Information Technology',
  'Textile Technology',
  'Mechanical Engineering (Sandwich)',
  'Applied Science',
  'Computer Systems and Design',
  'Applied Mathematics [2 Years]',
  'Cyber Security - Integrated [5 Years Integrated]',
  'Data Science [5 Years Integrated]',
  'Software Systems [5 Years Integrated]',
  'Theoretical Computer Science [5 Years Integrated]',
  'Fashion Design & Merchandising [5 Years Integrated]',
]

const emptyMember = () => ({ name: '', email: '', rollNumber: '', phone: '' })

export default function RegistrationForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    teamName:    '',
    department:  '',
    yearOfStudy: '',
    teamSize:    '1',
  })
  const [members,     setMembers]     = useState([emptyMember(), emptyMember()])
  const [errors,      setErrors]      = useState({})
  const [serverError, setServerError] = useState('')
  const [isLoading,   setIsLoading]   = useState(false)

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleMemberChange = (index, field, value) => {
    setMembers(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
    const key = `${index === 0 ? 'member1' : 'member2'}_${field}`
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    const count = parseInt(formData.teamSize)

    if (!formData.teamName.trim())
      newErrors.teamName = 'Team name is required'
    else if (formData.teamName.trim().length < 3)
      newErrors.teamName = 'Team name must be at least 3 characters'

    if (!formData.department)  newErrors.department  = 'Please select a department'
    if (!formData.yearOfStudy) newErrors.yearOfStudy = 'Please select year of study'

    for (let i = 0; i < count; i++) {
      const m      = members[i]
      const prefix = i === 0 ? 'member1' : 'member2'

      if (!m.name.trim())
        newErrors[`${prefix}_name`] = 'Name is required'
      else if (m.name.trim().length < 2)
        newErrors[`${prefix}_name`] = 'Name too short'

      if (!m.email.trim())
        newErrors[`${prefix}_email`] = 'Email ID is required'
      else if (!EMAIL_REGEX.test(m.email.trim()))
        newErrors[`${prefix}_email`] = 'Invalid format. Use: 24z365@psgtech.ac.in'

      if (!m.rollNumber.trim())
        newErrors[`${prefix}_rollNumber`] = 'Roll number is required'

      if (!m.phone.trim())
        newErrors[`${prefix}_phone`] = 'Phone number is required'
      else if (!PHONE_REGEX.test(m.phone.trim()))
        newErrors[`${prefix}_phone`] = 'Enter a valid 10-digit mobile number'
    }

    if (count === 2) {
      const m1 = members[0], m2 = members[1]
      if (m1.email && m2.email && m1.email.toLowerCase() === m2.email.toLowerCase())
        newErrors['member2_email'] = 'Member 2 email cannot be same as Member 1'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      const firstErrorEl = document.querySelector('[class*="inputError"]')
      if (firstErrorEl) firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setIsLoading(true)
    const count = parseInt(formData.teamSize)
    const payload = {
      teamName:    formData.teamName.trim(),
      department:  formData.department,
      yearOfStudy: parseInt(formData.yearOfStudy),
      teamSize:    count,
      members:     members.slice(0, count).map(m => ({
        name:       m.name.trim(),
        email:      m.email.trim().toLowerCase(),
        rollNumber: m.rollNumber.trim(),
        phone:      m.phone.trim(),
      })),
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/register`, payload)
      if (res.data.success) {
        onSuccess(res.data.data)
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      setServerError(msg)
      window.scrollTo({ top: document.getElementById('register').offsetTop - 80, behavior: 'smooth' })
    } finally {
      setIsLoading(false)
    }
  }

  const teamSize = parseInt(formData.teamSize)

  return (
    <section className={styles.section} id="register">
      <div className={styles.container}>

        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>
            <span className={styles.tagDot} />
            REGISTRATION PORTAL
          </div>
          <h2 className={styles.sectionTitle}>
            SECURE YOUR <span className={styles.titleAccent}>SLOT</span>
          </h2>
          <p className={styles.sectionSub}>
            Complete the form below to register your team for CipherClash.
            All fields marked with * are mandatory.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          {/* Server Error Banner */}
          {serverError && (
            <div className={styles.serverError}>
              <span className={styles.errorIcon}>⚠</span>
              <span>{serverError}</span>
            </div>
          )}

          {/* ── Section 01: Team Info ── */}
          <div className={styles.formSection}>
            <div className={styles.formSectionHeader}>
              <span className={styles.sectionNum}>01</span>
              <span className={styles.sectionName}>TEAM INFORMATION</span>
              <div className={styles.sectionLine} />
            </div>

            <div className={styles.teamGrid}>
              {/* Team Name */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelPrefix}>&gt; </span>
                  Team Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={`${styles.input} ${errors.teamName ? styles.inputError : ''}`}
                  placeholder="Enter your team name"
                  value={formData.teamName}
                  onChange={e => handleFormChange('teamName', e.target.value)}
                  autoComplete="off"
                  maxLength={40}
                />
                {errors.teamName && <span className={styles.errorMsg}>{errors.teamName}</span>}
              </div>

              {/* Team Size */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelPrefix}>&gt; </span>
                  Team Size <span className={styles.required}>*</span>
                </label>
                <div className={styles.toggleGroup}>
                  {['1', '2'].map(size => (
                    <button
                      key={size}
                      type="button"
                      className={`${styles.toggleBtn} ${formData.teamSize === size ? styles.toggleActive : ''}`}
                      onClick={() => handleFormChange('teamSize', size)}
                    >
                      {size === '1' ? 'SOLO' : 'DUO'}
                      <span className={styles.toggleSub}>{size} member{size === '2' ? 's' : ''}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Department */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelPrefix}>&gt; </span>
                  Department <span className={styles.required}>*</span>
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={`${styles.select} ${errors.department ? styles.inputError : ''}`}
                    value={formData.department}
                    onChange={e => handleFormChange('department', e.target.value)}
                  >
                    <option value="">— Select Department —</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <span className={styles.selectArrow}>▾</span>
                </div>
                {errors.department && <span className={styles.errorMsg}>{errors.department}</span>}
              </div>

              {/* Year of Study */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelPrefix}>&gt; </span>
                  Year of Study <span className={styles.required}>*</span>
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={`${styles.select} ${errors.yearOfStudy ? styles.inputError : ''}`}
                    value={formData.yearOfStudy}
                    onChange={e => handleFormChange('yearOfStudy', e.target.value)}
                  >
                    <option value="">— Select Year —</option>
                    {[1, 2, 3, 4, 5].map(y => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                  <span className={styles.selectArrow}>▾</span>
                </div>
                {errors.yearOfStudy && <span className={styles.errorMsg}>{errors.yearOfStudy}</span>}
              </div>
            </div>
          </div>

          {/* ── Section 02: Member Details ── */}
          <div className={styles.formSection}>
            <div className={styles.formSectionHeader}>
              <span className={styles.sectionNum}>02</span>
              <span className={styles.sectionName}>MEMBER DETAILS</span>
              <div className={styles.sectionLine} />
            </div>

            <MemberFields
              index={0}
              data={members[0]}
              onChange={handleMemberChange}
              errors={errors}
            />

            {teamSize === 2 && (
              <div className={styles.member2Wrapper}>
                <MemberFields
                  index={1}
                  data={members[1]}
                  onChange={handleMemberChange}
                  errors={errors}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className={styles.submitSection}>
            <div className={styles.submitNote}>
              <span className={styles.noteIcon}>🔒</span>
              Your data is secure. By registering, you agree to the event terms and conditions.
            </div>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner} />
                  PROCESSING...
                </>
              ) : (
                <>
                  CONFIRM REGISTRATION
                  <span className={styles.submitArrow}>→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
