// Sample documents for uploading to Azure AI Search
// This file can be used as a starting point to populate your knowledge base

const sampleDocuments = [
  {
    id: "1",
    title: "Rakhi Ghangas - DevOps Engineer Profile",
    content: `Rakhi Ghangas is a skilled DevOps Engineer with extensive experience in cloud platforms, automation, containerization, CI/CD pipelines, and infrastructure monitoring. With a strong background in IT and software development, she has demonstrated expertise in designing and implementing highly efficient, scalable, and secure infrastructure solutions.

Key competencies include:
- Cloud Platform Management (AWS, Azure, GCP)
- Infrastructure as Code (Terraform, CloudFormation, Bicep)
- Container Orchestration (Kubernetes, Docker)
- CI/CD Tools (Jenkins, GitLab CI, GitHub Actions, Azure DevOps)
- Monitoring and Logging Solutions
- Security and Compliance
- Database Management
- Automation and Scripting (Python, Bash, PowerShell)`,
    source: "profile.md",
    category: "profile"
  },
  {
    id: "2",
    title: "Professional Experience - DevOps Engineer",
    content: `Current Position: DevOps Engineer
Company: Interactive Pty Ltd, Sydney, Australia
Duration: 2023 - Present

Responsibilities and Achievements:
- Design and implement cloud infrastructure solutions leveraging Azure services
- Develop and maintain CI/CD pipelines for automated deployments
- Manage containerized applications using Kubernetes
- Implement Infrastructure as Code practices with Terraform and Bicep
- Monitor system performance and implement alerting mechanisms
- Collaborate with development teams to improve deployment processes
- Ensure security best practices are followed across all infrastructure
- Optimize cloud costs and resource utilization

Technologies: Azure, Kubernetes, Docker, Terraform, CI/CD, Python, PowerShell`,
    source: "experience.md",
    category: "experience"
  },
  {
    id: "3",
    title: "Previous Experience - Cloud Engineer",
    content: `Position: Cloud Engineer
Company: Walter & Eliza Hall Institute of Medical Research, Melbourne, Australia
Duration: 2019 - 2023

Key Achievements:
- Migrated on-premises infrastructure to cloud (AWS and Azure)
- Implemented automated backup and disaster recovery solutions
- Developed Python scripts for infrastructure automation
- Managed databases including optimization and security
- Established monitoring and alerting systems using CloudWatch and Application Insights
- Worked with medical research teams to ensure high availability and compliance
- Reduced infrastructure costs by 40% through resource optimization
- Implemented security controls and compliance measures for HIPAA

Technologies: AWS, Azure, Python, Terraform, Docker, Monitoring, Database Management`,
    source: "experience.md",
    category: "experience"
  },
  {
    id: "4",
    title: "Education & Qualifications",
    content: `Master of Information Technology
University: LaTrobe University, Melbourne, Australia
Duration: 2017 - 2019
GPA: Distinction

Specialization Areas:
- Cloud Computing and Infrastructure
- Software Development Principles
- Network Administration
- Database Design and Management
- Security in Information Systems

The master's degree provided a strong foundation in IT principles and software development methodologies, which complemented practical experience in DevOps practices.`,
    source: "education.md",
    category: "education"
  },
  {
    id: "5",
    title: "Core Technical Skills",
    content: `Cloud & Infrastructure:
- Azure (VMs, AKS, App Service, Functions, Storage, Networking)
- AWS (EC2, ECS, RDS, S3, Lambda, CloudFormation)
- GCP (Compute Engine, Cloud Run, Cloud SQL)

Infrastructure as Code:
- Terraform
- Azure Bicep and ARM Templates
- CloudFormation
- Ansible

Containerization & Orchestration:
- Docker
- Kubernetes (AKS, EKS)
- Container registries (ACR, ECR, Docker Hub)

CI/CD Tools:
- Azure DevOps
- GitHub Actions
- GitLab CI/CD
- Jenkins

Programming & Scripting:
- Python (automation, data processing)
- Bash & Shell scripting
- PowerShell
- JavaScript

Monitoring & Logging:
- Application Insights
- Azure Monitor
- CloudWatch
- Prometheus
- ELK Stack

Database Management:
- Azure SQL Database
- Azure Cosmos DB
- PostgreSQL, MySQL
- MongoDB
- Redis`,
    source: "skills.md",
    category: "skills"
  },
  {
    id: "6",
    title: "Projects & Achievements",
    content: `Major Projects:

1. Multi-Cloud Infrastructure Migration
- Successfully migrated medical research infrastructure to cloud
- Implemented in AWS and Azure for disaster recovery
- Achieved 99.99% uptime SLA
- Result: 40% cost reduction, improved scalability

2. Kubernetes Cluster Implementation
- Designed and deployed production Kubernetes cluster
- Implemented auto-scaling and load balancing
- Created monitoring and alerting solutions
- Result: 50% improvement in deployment speed

3. CI/CD Pipeline Automation
- Built comprehensive CI/CD pipelines using GitHub Actions
- Integrated security scanning and compliance checks
- Automated testing and deployment processes
- Result: 80% reduction in manual deployment time

4. Infrastructure as Code Transformation
- Migrated manual infrastructure to Infrastructure as Code
- Used Terraform and Bicep for all cloud resources
- Implemented version control for infrastructure
- Result: Improved consistency and disaster recovery capabilities

5. Cost Optimization Initiative
- Analyzed and optimized cloud resource utilization
- Implemented reserved instances and spot instances
- Conducted cloud cost analysis and recommendations
- Result: $500K+ annual savings`,
    source: "projects.md",
    category: "projects"
  },
  {
    id: "7",
    title: "Security & Compliance Certifications",
    content: `Certifications & Training:
- Azure Administrator Certified
- Kubernetes Certified Application Developer (CKAD)
- AWS Certified Solutions Architect
- Docker Certified Associate
- Terraform Associate

Compliance Knowledge:
- HIPAA (Healthcare compliance)
- GDPR (Data protection)
- SOC 2 Type II
- ISO 27001
- PCI DSS

Security Practices:
- Network security and firewalls
- Identity and Access Management (IAM)
- Encryption and key management
- Vulnerability scanning and patching
- Security incident response`,
    source: "certifications.md",
    category: "certifications"
  },
  {
    id: "8",
    title: "Blog & Articles",
    content: `Published Articles and Blog Posts:

1. "Kubernetes Best Practices for Production"
- Comprehensive guide to running Kubernetes in production
- Covers scaling, monitoring, and security
- Read on: personal blog

2. "Cloud Cost Optimization Strategies"
- Practical tips for reducing cloud spend
- Resource right-sizing techniques
- Reserved instance purchasing strategies

3. "Infrastructure as Code with Terraform"
- Getting started with Terraform
- Best practices for state management
- Module design patterns

4. "Mastering CI/CD Pipelines"
- Building efficient automated pipelines
- Testing strategies
- Deployment best practices

5. "Monitoring Microservices at Scale"
- Distributed tracing and logging
- Metrics and alerting strategies
- Debugging in microservice architectures`,
    source: "blog.md",
    category: "blog"
  }
];

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = sampleDocuments;
}

// Usage in upload script:
// const documents = require('./sample-documents.js');
// await client.uploadDocuments(documents);
