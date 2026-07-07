output "vpc_id" {
  value       = aws_vpc.main.id
  description = "The unique tracking ID assigned to the core VPC stack."
}

output "public_subnet_id" {
  value       = aws_subnet.public_1.id
  description = "The ID of the ingress public network segment."
}

output "private_app_subnet_id" {
  value       = aws_subnet.private_app_1.id
  description = "The ID of the secure internal application subnet."
}