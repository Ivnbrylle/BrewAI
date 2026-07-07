# ==============================================================================
# BrewAI Portfolio Prototype - Master Terraform Cloud Variables
# ==============================================================================

variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "The target AWS Region for all highly available infrastructure resources."
}

variable "project_name" {
  type        = string
  default     = "brewai"
  description = "Project name tracking prefix used to tag portfolio resources."
}

variable "environment" {
  type        = string
  default     = "dev"
  description = "Deployment environment modifier (e.g., dev, staging, prod)."
}

variable "vpc_cidr" {
  type        = string
  default     = "10.0.0.0/16"
  description = "Base CIDR block for the isolated network topography."
}